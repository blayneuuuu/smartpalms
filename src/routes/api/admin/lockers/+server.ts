import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/server/db";
import { lockers, users, subscriptions } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";

const VALID_SIZES = ["small", "medium", "large"] as const;
type LockerSize = (typeof VALID_SIZES)[number];

export const GET: RequestHandler = async ({ locals }) => {
  try {
    if (!locals.user || locals.user.type !== "admin") {
      return json(
        { authenticated: false, message: "User is not an admin." },
        { status: 403 },
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
        expiresAt: subscriptions.expiresAt,
      })
      .from(lockers)
      .leftJoin(users, eq(lockers.userId, users.id))
      .leftJoin(
        subscriptions,
        and(
          eq(subscriptions.lockerId, lockers.id),
          eq(subscriptions.status, "active"),
        ),
      )
      .orderBy(lockers.size, lockers.number);

    return json({ lockers: allLockers });
  } catch (error) {
    console.error("Error fetching lockers:", error);
    return json({ message: "Failed to fetch lockers" }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ locals, request }) => {
  try {
    if (!locals.user || locals.user.type !== "admin") {
      return json(
        { authenticated: false, message: "User is not an admin." },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { number, size } = body;

    console.log("Received locker creation request:", { number, size });

    if (!number || typeof number !== "string") {
      return json({ message: "Invalid locker number" }, { status: 400 });
    }

    if (!size || !VALID_SIZES.includes(size as LockerSize)) {
      return json({ message: "Invalid locker size" }, { status: 400 });
    }

    // Check if locker number already exists
    const [existingLocker] = await db
      .select()
      .from(lockers)
      .where(eq(lockers.number, number));

    if (existingLocker) {
      console.log("Locker with this number already exists:", number);
      return json(
        { message: "Locker with this number already exists" },
        { status: 400 },
      );
    }

    // Generate a UUID
    const id = crypto.randomUUID();
    console.log("Generated UUID for new locker:", id);

    // Create new locker
    const result = await db.insert(lockers).values({
      id,
      number,
      size: size as LockerSize,
      isOccupied: false,
    });

    console.log("Locker created successfully:", result);

    return json({ success: true, id });
  } catch (error) {
    console.error("Error creating locker:", error);
    if (error instanceof Error) {
      return json({ message: error.message }, { status: 500 });
    }
    return json({ message: "Failed to create locker" }, { status: 500 });
  }
};
