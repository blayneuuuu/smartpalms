import { e as error, j as json } from "../../../../../chunks/index.js";
import { d as db, a as admins, b as lockers, l as lockerRequests } from "../../../../../chunks/index2.js";
import { eq, sql, isNotNull } from "drizzle-orm";
const GET = async ({ locals }) => {
  const { userId } = locals.auth;
  if (!userId) {
    throw error(401, "Unauthorized");
  }
  const admin = await db.query.admins.findFirst({
    where: eq(admins.userId, userId)
  });
  if (!admin) {
    throw error(403, "Forbidden - Admin access required");
  }
  try {
    const totalLockersResult = await db.select({ count: sql`count(*)` }).from(lockers);
    const totalLockers = totalLockersResult[0]?.count ?? 0;
    const occupiedLockersResult = await db.select({ count: sql`count(*)` }).from(lockers).where(eq(lockers.isOccupied, true));
    const occupiedLockers = occupiedLockersResult[0]?.count ?? 0;
    const totalUsersResult = await db.select({ count: sql`count(distinct user_id)` }).from(lockers).where(isNotNull(lockers.userId));
    const totalUsers = totalUsersResult[0]?.count ?? 0;
    const pendingRequestsResult = await db.select({ count: sql`count(*)` }).from(lockerRequests).where(eq(lockerRequests.status, "pending"));
    const pendingRequests = pendingRequestsResult[0]?.count ?? 0;
    return json({
      totalLockers,
      occupiedLockers,
      totalUsers,
      pendingRequests
    });
  } catch (err) {
    console.error("Error fetching admin stats:", err);
    if (err instanceof Error) {
      throw error(500, err.message);
    }
    throw error(500, "Failed to fetch admin statistics");
  }
};
export {
  GET
};
