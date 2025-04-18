import {json} from "@sveltejs/kit";
import type {RequestHandler} from "./$types";
import {directClient} from "$lib/db/direct-client";

// This endpoint is only for development/test purposes
export const GET: RequestHandler = async ({url}) => {
  if (process.env.NODE_ENV === "production") {
    return json({error: "Not available in production"}, {status: 403});
  }

  const lockerId = url.searchParams.get("lockerId");

  if (!lockerId) {
    return json({error: "Missing lockerId parameter"}, {status: 400});
  }

  try {
    console.log(`Cleaning up subscriptions for locker: ${lockerId}`);

    // First check if there are active subscriptions
    const activeSubscriptions = await directClient.execute({
      sql: `
        SELECT id FROM subscriptions 
        WHERE locker_id = ? AND status = 'active'
      `,
      args: [lockerId],
    });

    const subscriptionIds = activeSubscriptions.rows.map((row) => row.id);

    if (subscriptionIds.length === 0) {
      console.log("No active subscriptions found for this locker");

      // Just in case, we'll verify and fix the locker's isOccupied state
      await directClient.execute({
        sql: `
          UPDATE lockers
          SET is_occupied = 0, user_id = NULL
          WHERE id = ?
        `,
        args: [lockerId],
      });

      return json({
        message:
          "No active subscriptions found for this locker. Locker status reset.",
        cleanedSubscriptions: 0,
      });
    }

    console.log(
      `Found ${subscriptionIds.length} active subscriptions to clean up`
    );

    // Update all active subscriptions to expired
    await directClient.execute({
      sql: `
        UPDATE subscriptions
        SET status = 'expired'
        WHERE locker_id = ? AND status = 'active'
      `,
      args: [lockerId],
    });

    // Reset the locker's status
    await directClient.execute({
      sql: `
        UPDATE lockers
        SET is_occupied = 0, user_id = NULL
        WHERE id = ?
      `,
      args: [lockerId],
    });

    return json({
      message: "Successfully cleaned up subscriptions and reset locker status",
      cleanedSubscriptions: subscriptionIds.length,
      subscriptionIds,
    });
  } catch (error) {
    console.error("Error cleaning up subscriptions:", error);
    return json({error: "Failed to clean up subscriptions"}, {status: 500});
  }
};
