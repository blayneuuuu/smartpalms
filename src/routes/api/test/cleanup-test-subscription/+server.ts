import {json} from "@sveltejs/kit";
import type {RequestHandler} from "@sveltejs/kit";
import {db} from "$lib/server/db";
import {subscriptions, lockers} from "$lib/server/db/schema";
import {eq} from "drizzle-orm";
import {dev} from "$app/environment";

/**
 * Test endpoint to clean up test subscriptions created for testing the cron job
 * Only available in development mode
 */
export const GET: RequestHandler = async () => {
  try {
    // Only allow in development mode
    if (!dev) {
      return json(
        {
          success: false,
          message: "This endpoint is only available in development mode",
        },
        {status: 403}
      );
    }

    console.log("Cleaning up test subscriptions...");

    // Find all active subscriptions
    const testSubscriptions = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.status, "active"));

    console.log(`Found ${testSubscriptions.length} active subscriptions`);

    // Filter those that are test subscriptions based on expiresAt being today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const testSubsToCleanup = testSubscriptions.filter((sub) => {
      const expiryDate = new Date(sub.expiresAt);
      return expiryDate >= today && expiryDate < tomorrow;
    });

    console.log(
      `Found ${testSubsToCleanup.length} test subscriptions to clean up`
    );

    if (testSubsToCleanup.length === 0) {
      return json({
        success: true,
        message: "No test subscriptions found",
        count: 0,
      });
    }

    // Update lockers and delete subscriptions in a transaction
    await db.transaction(async (tx) => {
      // Update each locker first
      for (const subscription of testSubsToCleanup) {
        await tx
          .update(lockers)
          .set({
            isOccupied: false,
            userId: null,
          })
          .where(eq(lockers.id, subscription.lockerId));
      }

      // Then delete the subscriptions
      const subscriptionIds = testSubsToCleanup.map((sub) => sub.id);
      for (const id of subscriptionIds) {
        await tx.delete(subscriptions).where(eq(subscriptions.id, id));
      }
    });

    return json({
      success: true,
      message: "Test subscriptions cleaned up successfully",
      count: testSubsToCleanup.length,
      subscriptions: testSubsToCleanup.map((sub) => ({
        id: sub.id,
        lockerId: sub.lockerId,
        expiresAt: sub.expiresAt,
      })),
    });
  } catch (error) {
    console.error("Error cleaning up test subscriptions:", error);

    return json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      {status: 500}
    );
  }
};
