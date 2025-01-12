import {json} from "@sveltejs/kit";
import {error} from "@sveltejs/kit";
import type {AuthenticatedRequestHandler} from "../../types";
import {db} from "$lib/server/db";
import {lockerRequests, lockers, admins} from "$lib/server/db/schema";
import {eq, isNotNull, sql} from "drizzle-orm";

export const GET: AuthenticatedRequestHandler = async ({locals}) => {
  const {userId} = locals.auth;
  if (!userId) {
    throw error(401, "Unauthorized");
  }

  // Verify admin status
  const admin = await db.query.admins.findFirst({
    where: eq(admins.userId, userId),
  });

  if (!admin) {
    throw error(403, "Forbidden - Admin access required");
  }

  try {
    // Get total lockers count
    const totalLockersResult = await db
      .select({count: sql<number>`count(*)`})
      .from(lockers);
    const totalLockers = totalLockersResult[0]?.count ?? 0;

    // Get occupied lockers count
    const occupiedLockersResult = await db
      .select({count: sql<number>`count(*)`})
      .from(lockers)
      .where(eq(lockers.isOccupied, true));
    const occupiedLockers = occupiedLockersResult[0]?.count ?? 0;

    // Get total users count (unique users with lockers)
    const totalUsersResult = await db
      .select({count: sql<number>`count(distinct user_id)`})
      .from(lockers)
      .where(isNotNull(lockers.userId));
    const totalUsers = totalUsersResult[0]?.count ?? 0;

    // Get pending requests count
    const pendingRequestsResult = await db
      .select({count: sql<number>`count(*)`})
      .from(lockerRequests)
      .where(eq(lockerRequests.status, "pending"));
    const pendingRequests = pendingRequestsResult[0]?.count ?? 0;

    return json({
      totalLockers,
      occupiedLockers,
      totalUsers,
      pendingRequests,
    });
  } catch (err) {
    console.error("Error fetching admin stats:", err);
    if (err instanceof Error) {
      throw error(500, err.message);
    }
    throw error(500, "Failed to fetch admin statistics");
  }
};
