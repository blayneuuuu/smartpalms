import {json} from "@sveltejs/kit";
import type {RequestHandler} from "@sveltejs/kit";
import {SubscriptionService} from "$lib/services/core/subscription.service";

/**
 * Test endpoint to check for subscriptions expiring today (the current day)
 * Only returns the list without sending emails
 */
export const GET: RequestHandler = async () => {
  try {
    console.log("Testing check for subscriptions expiring today...");

    // Get subscriptions expiring today
    const expiringSubscriptions =
      await SubscriptionService.findSubscriptionsExpiringToday();

    console.log(
      `Found ${expiringSubscriptions.length} subscriptions expiring today`
    );

    return json({
      success: true,
      count: expiringSubscriptions.length,
      subscriptions: expiringSubscriptions,
    });
  } catch (error) {
    console.error("Error checking expiring subscriptions:", error);

    return json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      {status: 500}
    );
  }
};
