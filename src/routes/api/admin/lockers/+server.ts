import {json} from "@sveltejs/kit";
import type {RequestHandler} from "./$types";
import {db} from "$lib/server/db";
import {lockers, users} from "$lib/server/db/schema";
import {eq} from "drizzle-orm";
import {randomUUID} from "crypto";

const VALID_SIZES = ["small", "medium", "large"] as const;
type LockerSize = (typeof VALID_SIZES)[number];

export const GET: RequestHandler = async ({locals}) => {
  try {
    if (!locals.user || locals.user.type !== "admin") {
      return json(
        {authenticated: false, message: "User is not an admin."},
        {status: 403}
      );
    }

    const allLockers = await db
      .select({
        id: lockers.id,
        number: lockers.number,
        size: lockers.size,
        userId: lockers.userId,
        userName: users.name,
        userEmail: users.email,
      })
      .from(lockers)
      .leftJoin(users, eq(lockers.userId, users.id))
      .orderBy(lockers.size, lockers.number);

    return json({lockers: allLockers});
  } catch (error) {
    console.error("Error fetching lockers:", error);
    return json({message: "Failed to fetch lockers"}, {status: 500});
  }
};

export const POST: RequestHandler = async ({locals, request}) => {
  try {
    if (!locals.user || locals.user.type !== "admin") {
      return json(
        {authenticated: false, message: "User is not an admin."},
        {status: 403}
      );
    }

    const body = await request.json();
    const {number, size} = body;

    if (!number || typeof number !== "string") {
      return json({message: "Invalid locker number"}, {status: 400});
    }

    if (!size || !VALID_SIZES.includes(size as LockerSize)) {
      return json({message: "Invalid locker size"}, {status: 400});
    }

    // Check if locker number already exists
    const [existingLocker] = await db
      .select()
      .from(lockers)
      .where(eq(lockers.number, number));

    if (existingLocker) {
      return json(
        {message: "Locker with this number already exists"},
        {status: 400}
      );
    }

    // Create new locker
    await db.insert(lockers).values({
      id: randomUUID(),
      number,
      size: size as LockerSize,
      isOccupied: false,
    });

    return json({success: true});
  } catch (error) {
    console.error("Error creating locker:", error);
    if (error instanceof Error) {
      return json({message: error.message}, {status: 500});
    }
    return json({message: "Failed to create locker"}, {status: 500});
  }
};
