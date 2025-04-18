import {json} from "@sveltejs/kit";
import type {RequestHandler} from "./$types";
import {directClient} from "$lib/db/direct-client";

// This endpoint is only for development/test purposes
export const GET: RequestHandler = async () => {
  if (process.env.NODE_ENV === "production") {
    return json({error: "Not available in production"}, {status: 403});
  }

  try {
    console.log("Retrieving all active subscriptions");

    // Get all active subscriptions with locker and user info
    const result = await directClient.execute({
      sql: `
        SELECT 
          s.id, s.status, s.user_id, s.locker_id, s.expires_at, s.created_at,
          l.number as locker_number, l.is_occupied,
          u.name as user_name, u.email as user_email
        FROM subscriptions s
        LEFT JOIN lockers l ON s.locker_id = l.id
        LEFT JOIN users u ON s.user_id = u.id
        WHERE s.status = 'active'
        ORDER BY s.created_at DESC
      `,
      args: [],
    });

    // Count active subscriptions per locker
    const lockerCountsResult = await directClient.execute({
      sql: `
        SELECT locker_id, COUNT(*) as count
        FROM subscriptions
        WHERE status = 'active'
        GROUP BY locker_id
        HAVING COUNT(*) > 0
      `,
      args: [],
    });

    // Count active subscriptions per user
    const userCountsResult = await directClient.execute({
      sql: `
        SELECT user_id, COUNT(*) as count
        FROM subscriptions
        WHERE status = 'active'
        GROUP BY user_id
        HAVING COUNT(*) > 0
      `,
      args: [],
    });

    // Get lockers with inconsistent state (occupied but no active subscription or has active subscription but not occupied)
    const inconsistentLockersResult = await directClient.execute({
      sql: `
        SELECT 
          l.id, l.number, l.is_occupied, l.user_id,
          (SELECT COUNT(*) FROM subscriptions WHERE locker_id = l.id AND status = 'active') as active_subs
        FROM lockers l
        WHERE 
          (l.is_occupied = 1 AND (SELECT COUNT(*) FROM subscriptions WHERE locker_id = l.id AND status = 'active') = 0)
          OR 
          (l.is_occupied = 0 AND (SELECT COUNT(*) FROM subscriptions WHERE locker_id = l.id AND status = 'active') > 0)
      `,
      args: [],
    });

    return json({
      activeSubscriptions: result.rows,
      totalCount: result.rows.length,
      lockerCounts: lockerCountsResult.rows,
      userCounts: userCountsResult.rows,
      inconsistentLockers: inconsistentLockersResult.rows,
    });
  } catch (error) {
    console.error("Error retrieving active subscriptions:", error);
    return json(
      {error: "Failed to retrieve active subscriptions"},
      {status: 500}
    );
  }
};
