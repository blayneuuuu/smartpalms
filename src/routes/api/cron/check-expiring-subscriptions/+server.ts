import {json} from "@sveltejs/kit";
import type {RequestHandler} from "@sveltejs/kit";
import {SubscriptionService} from "$lib/services/core/subscription.service";
import {UserService} from "$lib/services/core/user.service";
import {sendExpirationNotificationEmail} from "$lib/services/EmailService";

/**
 * This endpoint is called by a Vercel cron job to check for subscriptions
 * expiring on the current day and send email notifications to affected users.
 * It also updates user statuses.
 *
 * Cron schedule: 0 0 * * * (runs daily at midnight 00:00)
 */
export const GET: RequestHandler = async () => {
  try {
    console.log("Starting check for subscriptions expiring today...");

    // Update expired subscriptions and make lockers available
    await SubscriptionService.checkAndUpdateExpiredSubscriptions();

    // Get subscriptions expiring today
    const expiringSubscriptions =
      await SubscriptionService.findSubscriptionsExpiringToday();

    console.log(
      `Found ${expiringSubscriptions.length} subscriptions expiring today`
    );

    // Send email to each affected user
    const emailResults = [];
    const affectedUserIds = new Set<string>();

    for (const subscription of expiringSubscriptions) {
      console.log(
        `Processing subscription: ${subscription.subscriptionId} for user: ${subscription.userEmail}`
      );

      // Add userId to affected users for status update later
      affectedUserIds.add(subscription.userId);

      try {
        const emailResult = await sendExpirationNotificationEmail(
          subscription.userEmail,
          subscription.userName,
          subscription.lockerNumber,
          subscription.expiresAt
        );

        emailResults.push({
          subscriptionId: subscription.subscriptionId,
          userEmail: subscription.userEmail,
          success: true,
          simulated: emailResult.simulated,
        });
      } catch (error) {
        console.error(
          `Error sending notification for subscription ${subscription.subscriptionId}:`,
          error
        );

        emailResults.push({
          subscriptionId: subscription.subscriptionId,
          userEmail: subscription.userEmail,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // Update user statuses for affected users
    let statusUpdateCount = 0;
    if (affectedUserIds.size > 0) {
      console.log(
        `Updating statuses for ${affectedUserIds.size} affected users`
      );

      for (const userId of affectedUserIds) {
        const result =
          await UserService.updateUserStatusBasedOnSubscriptions(userId);
        if (result.success) {
          statusUpdateCount++;
          console.log(`Updated user ${userId} status to: ${result.status}`);
        } else {
          console.error(
            `Failed to update user ${userId} status: ${result.error}`
          );
        }
      }
    }

    // Also run a periodic check on all users once a day
    console.log("Running daily batch update of all user statuses");
    const batchUpdateCount = await UserService.batchUpdateUserStatuses();
    console.log(`Batch updated ${batchUpdateCount} user statuses`);

    // Return summary of notifications sent
    const successCount = emailResults.filter((r) => r.success).length;
    const failureCount = emailResults.length - successCount;

    console.log(
      `Notification summary: ${successCount} sent successfully, ${failureCount} failed`
    );

    return json({
      success: true,
      totalExpiring: expiringSubscriptions.length,
      notificationsSent: successCount,
      notificationsFailed: failureCount,
      statusUpdates: statusUpdateCount,
      batchStatusUpdates: batchUpdateCount,
      details: emailResults,
    });
  } catch (error) {
    console.error("Error processing expiring subscriptions:", error);

    return json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unknown error while processing expiring subscriptions",
      },
      {status: 500}
    );
  }
};
