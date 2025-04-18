import {json} from "@sveltejs/kit";
import type {RequestHandler} from "./$types";
import {db} from "$lib/server/db";
import {subscriptions, lockers, transactions} from "$lib/server/db/schema";
import {eq} from "drizzle-orm";
import {
  UserService,
  type StatusUpdateResult,
} from "$lib/services/core/user.service";

// DELETE a subscription
export const DELETE: RequestHandler = async ({locals, params}) => {
  try {
    if (!locals.user || locals.user.type !== "admin") {
      return json(
        {authenticated: false, message: "User is not an admin."},
        {status: 403}
      );
    }

    const subscriptionId = params.id;
    if (!subscriptionId) {
      return json({message: "Subscription ID is required"}, {status: 400});
    }

    // Get subscription details
    const [existingSubscription] = await db
      .select({
        id: subscriptions.id,
        lockerId: subscriptions.lockerId,
        userId: subscriptions.userId,
      })
      .from(subscriptions)
      .where(eq(subscriptions.id, subscriptionId));

    if (!existingSubscription) {
      return json({message: "Subscription not found"}, {status: 404});
    }

    // Store the user ID to update their status after deletion
    const userId = existingSubscription.userId;

    // Check if there are any transactions related to this subscription
    const relatedTransactions = await db
      .select({id: transactions.id})
      .from(transactions)
      .where(eq(transactions.subscriptionId, subscriptionId));

    // Use a transaction to ensure all operations succeed or fail together
    await db.transaction(async (tx) => {
      // If there are related transactions, update them to remove the reference to the subscription
      if (relatedTransactions.length > 0) {
        await tx
          .update(transactions)
          .set({
            subscriptionId: null,
          })
          .where(eq(transactions.subscriptionId, subscriptionId));
      }

      // Delete the subscription
      await tx
        .delete(subscriptions)
        .where(eq(subscriptions.id, subscriptionId));

      // Update the locker to be available
      await tx
        .update(lockers)
        .set({
          isOccupied: false,
          userId: null,
        })
        .where(eq(lockers.id, existingSubscription.lockerId));
    });

    // Verify the locker was updated correctly
    const [updatedLocker] = await db
      .select()
      .from(lockers)
      .where(eq(lockers.id, existingSubscription.lockerId));

    // Update the user's status based on their remaining active subscriptions
    let userStatusUpdateResult: StatusUpdateResult = {
      success: false,
      error: "User ID not available",
    };

    if (userId) {
      userStatusUpdateResult =
        await UserService.updateUserStatusBasedOnSubscriptions(userId);
      console.log(
        `User status update after subscription removal: ${
          userStatusUpdateResult.success
            ? `Successfully updated to ${userStatusUpdateResult.status || "unknown"}`
            : `Failed: ${userStatusUpdateResult.error}`
        }`
      );
    }

    return json({
      success: true,
      message: "Subscription deleted successfully",
      locker: updatedLocker,
      userStatusUpdate: userStatusUpdateResult,
    });
  } catch (error) {
    console.error("Error deleting subscription:", error);
    if (error instanceof Error) {
      return json({message: error.message}, {status: 500});
    }
    return json({message: "Failed to delete subscription"}, {status: 500});
  }
};
