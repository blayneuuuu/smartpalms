import {json} from "@sveltejs/kit";
import type {RequestHandler} from "./$types";
import {directClient} from "$lib/db/direct-client";
import {UserService} from "$lib/services/core/user.service";

// Define interface for the response results
interface FixResults {
  inconsistentLockersFixed: number;
  duplicateSubscriptionsRemoved: number;
  userStatusesUpdated: number;
  details: string[];
}

// This endpoint is only for development/test purposes
export const GET: RequestHandler = async () => {
  if (process.env.NODE_ENV === "production") {
    return json({error: "Not available in production"}, {status: 403});
  }

  try {
    console.log("Starting database state fix operation");
    const results: FixResults = {
      inconsistentLockersFixed: 0,
      duplicateSubscriptionsRemoved: 0,
      userStatusesUpdated: 0,
      details: [],
    };

    // Step 1: Find lockers with inconsistent state (occupied but no active subscription or vice versa)
    const inconsistentLockers = await directClient.execute({
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

    console.log(
      `Found ${inconsistentLockers.rows.length} lockers with inconsistent state`
    );

    // Fix each inconsistent locker
    for (const locker of inconsistentLockers.rows) {
      const lockerId = String(locker.id);
      const number = String(locker.number);
      const isOccupied = locker.is_occupied === 1;
      const activeSubsCount =
        typeof locker.active_subs === "number" ? locker.active_subs : 0;

      console.log(
        `Fixing locker #${number} (${lockerId}): isOccupied=${isOccupied}, activeSubscriptions=${activeSubsCount}`
      );

      // Case 1: Locker is marked as occupied but has no active subscriptions
      if (isOccupied && activeSubsCount === 0) {
        await directClient.execute({
          sql: `
            UPDATE lockers
            SET is_occupied = 0, user_id = NULL
            WHERE id = ?
          `,
          args: [lockerId],
        });

        results.details.push(
          `Locker #${number}: Marked as available (was incorrectly occupied)`
        );
      }

      // Case 2: Locker is marked as available but has active subscriptions
      else if (!isOccupied && activeSubsCount > 0) {
        // Get the most recent active subscription for this locker
        const activeSubQuery = await directClient.execute({
          sql: `
            SELECT id, user_id, status
            FROM subscriptions
            WHERE locker_id = ? AND status = 'active'
            ORDER BY created_at DESC
            LIMIT 1
          `,
          args: [lockerId],
        });

        if (activeSubQuery.rows.length > 0) {
          const subscription = activeSubQuery.rows[0];
          const userId = String(subscription.user_id);

          // Update the locker to match the subscription
          await directClient.execute({
            sql: `
              UPDATE lockers
              SET is_occupied = 1, user_id = ?
              WHERE id = ?
            `,
            args: [userId, lockerId],
          });

          results.details.push(
            `Locker #${number}: Marked as occupied based on active subscription`
          );
        }
      }

      results.inconsistentLockersFixed++;
    }

    // Step 2: Remove duplicate active subscriptions for the same locker
    const duplicateSubscriptions = await directClient.execute({
      sql: `
        SELECT locker_id, COUNT(*) as count
        FROM subscriptions
        WHERE status = 'active'
        GROUP BY locker_id
        HAVING COUNT(*) > 1
      `,
      args: [],
    });

    console.log(
      `Found ${duplicateSubscriptions.rows.length} lockers with duplicate active subscriptions`
    );

    // Fix each case of duplicate subscriptions
    for (const dupe of duplicateSubscriptions.rows) {
      const lockerId = String(dupe.locker_id);

      // Get all active subscriptions for this locker, ordered by creation date (newest first)
      const activeSubscriptions = await directClient.execute({
        sql: `
          SELECT id, locker_id, user_id, created_at
          FROM subscriptions
          WHERE locker_id = ? AND status = 'active'
          ORDER BY created_at DESC
        `,
        args: [lockerId],
      });

      // Keep the most recent subscription active, mark others as expired
      if (activeSubscriptions.rows.length > 1) {
        // Skip the first one (most recent), mark the rest as expired
        for (let i = 1; i < activeSubscriptions.rows.length; i++) {
          const subId = String(activeSubscriptions.rows[i].id);

          await directClient.execute({
            sql: `
              UPDATE subscriptions
              SET status = 'expired'
              WHERE id = ?
            `,
            args: [subId],
          });

          results.duplicateSubscriptionsRemoved++;
          results.details.push(
            `Subscription ${subId}: Marked as expired (duplicate for same locker)`
          );
        }
      }
    }

    // Step 3: Update all user statuses based on their subscriptions
    const updatedUserCount = await UserService.batchUpdateUserStatuses();
    results.userStatusesUpdated = updatedUserCount;

    return json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("Error fixing database state:", error);
    return json({error: "Failed to fix database state"}, {status: 500});
  }
};
