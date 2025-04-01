import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/server/db";
import { accessHistory, lockers, users } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

export const GET: RequestHandler = async ({ locals }) => {
  try {
    if (!locals.user || locals.user.type !== "admin") {
      return json(
        { authenticated: false, message: "User is not an admin." },
        { status: 403 },
      );
    }

    const history = await db
      .select({
        id: accessHistory.id,
        lockerId: accessHistory.lockerId,
        lockerNumber: lockers.number,
        userId: accessHistory.userId,
        userName: users.name,
        userEmail: users.email,
        accessType: accessHistory.accessType,
        otp: accessHistory.otp,
        status: accessHistory.status,
        accessedAt: accessHistory.accessedAt,
      })
      .from(accessHistory)
      .leftJoin(lockers, eq(accessHistory.lockerId, lockers.id))
      .leftJoin(users, eq(accessHistory.userId, users.id))
      .orderBy(accessHistory.accessedAt);

    return json({ history });
  } catch (error) {
    console.error("Error fetching access history:", error);
    return json({ message: "Failed to fetch access history" }, { status: 500 });
  }
};
