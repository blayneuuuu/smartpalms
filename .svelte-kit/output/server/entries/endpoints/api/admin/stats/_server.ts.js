import { j as json } from "../../../../../chunks/index.js";
import { d as db, l as lockers, u as users, a as lockerRequests } from "../../../../../chunks/index2.js";
import { eq } from "drizzle-orm";
const GET = async ({ locals }) => {
  try {
    if (!locals.user || locals.user.type !== "admin") {
      return json(
        { authenticated: false, message: "User is not an admin." },
        { status: 403 }
      );
    }
    const totalLockers = await db.select().from(lockers);
    const occupiedLockers = totalLockers.filter(
      (locker) => locker.isOccupied === true
    );
    const allUsers = await db.select().from(users).where(eq(users.type, "user"));
    const pendingRequests = await db.select().from(lockerRequests).where(eq(lockerRequests.status, "pending"));
    return json({
      totalLockers: totalLockers.length,
      occupiedLockers: occupiedLockers.length,
      totalUsers: allUsers.length,
      pendingRequests: pendingRequests.length
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return json({ message: "Failed to fetch admin stats" }, { status: 500 });
  }
};
export {
  GET
};
