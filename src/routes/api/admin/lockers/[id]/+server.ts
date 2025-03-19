import {json} from "@sveltejs/kit";
import type {RequestHandler} from "./$types";
import {db} from "$lib/server/db";
import {lockers, users, subscriptions} from "$lib/server/db/schema";
import {eq, and} from "drizzle-orm";

// PATCH update locker ownership
export const PATCH: RequestHandler = async ({locals, params, request}) => {
  try {
    console.log("Starting locker ownership update request");

    if (!locals.user || locals.user.type !== "admin") {
      return json(
        {authenticated: false, message: "User is not an admin."},
        {status: 403}
      );
    }

    const lockerId = params.id;
    if (!lockerId) {
      return json({message: "Locker ID is required"}, {status: 400});
    }

    const body = await request.json();
    const {userId} = body;

    console.log("Update locker request:", {lockerId, userId});

    // Check if locker exists
    const [existingLocker] = await db
      .select()
      .from(lockers)
      .where(eq(lockers.id, lockerId));

    if (!existingLocker) {
      console.log("Locker not found:", lockerId);
      return json({message: "Locker not found"}, {status: 404});
    }

    console.log("Existing locker:", existingLocker);

    // If userId is null, we're removing ownership
    if (userId === null) {
      console.log("Removing locker ownership");

      // Check if there are active subscriptions
      const [activeSubscription] = await db
        .select()
        .from(subscriptions)
        .where(
          and(
            eq(subscriptions.lockerId, lockerId),
            eq(subscriptions.status, "active")
          )
        );

      if (activeSubscription) {
        console.log(
          "Cannot remove ownership - active subscription exists:",
          activeSubscription
        );
        return json(
          {
            message:
              "Cannot remove ownership: active subscription exists. Delete the subscription first.",
          },
          {status: 400}
        );
      }

      // Update locker to remove ownership
      await db
        .update(lockers)
        .set({
          isOccupied: false,
          userId: null,
        })
        .where(eq(lockers.id, lockerId));

      console.log("Ownership removed successfully");
    } else {
      // Verify the user exists
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));

      if (!existingUser) {
        console.log("User not found:", userId);
        return json({message: "User not found"}, {status: 404});
      }

      console.log("Updating locker ownership to user:", existingUser.name);

      // Update locker with new ownership
      await db
        .update(lockers)
        .set({
          isOccupied: true,
          userId,
        })
        .where(eq(lockers.id, lockerId));

      console.log("Ownership updated successfully");
    }

    // Get the updated locker to verify changes
    const [updatedLocker] = await db
      .select()
      .from(lockers)
      .where(eq(lockers.id, lockerId));

    console.log("Updated locker:", updatedLocker);

    return json({
      success: true,
      locker: updatedLocker,
    });
  } catch (error) {
    console.error("Error updating locker ownership:", error);
    if (error instanceof Error) {
      return json({message: error.message}, {status: 500});
    }
    return json({message: "Failed to update locker ownership"}, {status: 500});
  }
};
