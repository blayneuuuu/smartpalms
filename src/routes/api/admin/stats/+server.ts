import {json} from "@sveltejs/kit";
import {error} from "@sveltejs/kit";
import {db} from "$lib/server/db";
import {lockerRequests, lockers, users} from "$lib/server/db/schema";
import {eq, isNotNull, sql} from "drizzle-orm";
import type {RequestHandler} from "./$types";

export const GET: RequestHandler = async ({locals}) => {
  // @ts-expect-error - we know user exists from hooks
  if (locals.user?.type !== "admin") {
    throw error(403, "Unauthorized");
  }

  try {
    const [totalLockers] = await db
      .select({count: sql<number>`count(*)`})
      .from(lockers);

    const [occupiedLockers] = await db
      .select({count: sql<number>`count(*)`})
      .from(lockers)
      .where(isNotNull(lockers.userId));

    const [totalUsers] = await db
      .select({count: sql<number>`count(*)`})
      .from(users)
      .where(eq(users.type, "user"));

    const [pendingRequests] = await db
      .select({count: sql<number>`count(*)`})
      .from(lockerRequests)
      .where(eq(lockerRequests.status, "pending"));

    return json({
      totalLockers: totalLockers.count,
      occupiedLockers: occupiedLockers.count,
      totalUsers: totalUsers.count,
      pendingRequests: pendingRequests.count,
    });
  } catch (err) {
    console.error("Error fetching admin stats:", err);
    throw error(500, "Failed to fetch admin stats");
  }
};
