import {json} from "@sveltejs/kit";
import type {RequestHandler} from "./$types";
import {db} from "$lib/server/db";
import {lockers, users, lockerRequests} from "$lib/server/db/schema";
import {eq} from "drizzle-orm";

export const GET: RequestHandler = async ({locals}) => {
  try {
    if (!locals.user || locals.user.type !== "admin") {
      return json(
        {authenticated: false, message: "User is not an admin."},
        {status: 403}
      );
    }

    // Get total lockers count
    const totalLockers = await db.select().from(lockers);
    console.log(
      "Debug - All lockers:",
      totalLockers.map((l) => ({
        id: l.id,
        number: l.number,
        isOccupied: l.isOccupied,
        userId: l.userId,
      }))
    );

    // Get occupied lockers count
    const occupiedLockers = totalLockers.filter(
      (locker) => locker.isOccupied === true
    );
    console.log("Debug - Occupied lockers count:", occupiedLockers.length);
    console.log(
      "Debug - Occupied locker details:",
      occupiedLockers.map((l) => ({
        id: l.id,
        number: l.number,
        isOccupied: l.isOccupied,
        userId: l.userId,
      }))
    );

    // Get total users count (excluding admins)
    const allUsers = await db
      .select()
      .from(users)
      .where(eq(users.type, "user"));

    // Get pending requests count
    const pendingRequests = await db
      .select()
      .from(lockerRequests)
      .where(eq(lockerRequests.status, "pending"));

    // Return counts as numbers
    return json({
      totalLockers: totalLockers.length,
      occupiedLockers: occupiedLockers.length,
      totalUsers: allUsers.length,
      pendingRequests: pendingRequests.length,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return json({message: "Failed to fetch admin stats"}, {status: 500});
  }
};
