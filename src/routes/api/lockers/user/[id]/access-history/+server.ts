import {json} from "@sveltejs/kit";
import {error} from "@sveltejs/kit";
import type {RequestHandler} from "./$types";
import {db} from "$lib/server/db";
import {accessHistory, lockers} from "$lib/server/db/schema";
import {eq} from "drizzle-orm";

export const GET: RequestHandler = async ({params, locals}) => {
  if (!locals.user) {
    throw error(401, "Unauthorized");
  }

  const userId = params.id;
  if (!userId) {
    throw error(400, "User ID is required");
  }

  // Verify user is accessing their own history
  if (userId !== locals.user.id) {
    throw error(403, "You can only access your own history");
  }

  try {
    // Get all access history for user's lockers
    const history = await db
      .select({
        id: accessHistory.id,
        lockerId: accessHistory.lockerId,
        lockerNumber: lockers.number,
        accessType: accessHistory.accessType,
        otp: accessHistory.otp,
        status: accessHistory.status,
        accessedAt: accessHistory.accessedAt,
      })
      .from(accessHistory)
      .leftJoin(lockers, eq(accessHistory.lockerId, lockers.id))
      .where(eq(lockers.userId, userId))
      .orderBy(accessHistory.accessedAt);

    return json({
      success: true,
      history,
    });
  } catch (err) {
    console.error("Error fetching access history:", err);
    throw error(500, "Failed to fetch access history");
  }
};
