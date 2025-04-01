import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/server/db";
import { subscriptions, lockers, users } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";
import type { Status } from "$lib/server/db/schema";

// GET all subscriptions
export const GET: RequestHandler = async ({ locals }) => {
  try {
    if (!locals.user || locals.user.type !== "admin") {
      return json(
        { authenticated: false, message: "User is not an admin." },
        { status: 403 },
      );
    }

    const allSubscriptions = await db
      .select({
        id: subscriptions.id,
        status: subscriptions.status,
        lockerId: subscriptions.lockerId,
        lockerNumber: lockers.number,
        lockerSize: lockers.size,
        userId: subscriptions.userId,
        userName: users.name,
        userEmail: users.email,
        expiresAt: subscriptions.expiresAt,
        createdAt: subscriptions.createdAt,
      })
      .from(subscriptions)
      .leftJoin(lockers, eq(subscriptions.lockerId, lockers.id))
      .leftJoin(users, eq(subscriptions.userId, users.id))
      .orderBy(subscriptions.createdAt);

    return json({ subscriptions: allSubscriptions });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return json({ message: "Failed to fetch subscriptions" }, { status: 500 });
  }
};

// Create a new subscription
export const POST: RequestHandler = async ({ locals, request }) => {
  try {
    if (!locals.user || locals.user.type !== "admin") {
      return json(
        { authenticated: false, message: "User is not an admin." },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, lockerId, expiresAt, status = "active" } = body;

    if (!userId || !lockerId || !expiresAt) {
      return json(
        {
          message:
            "Missing required fields: userId, lockerId, and expiresAt are required",
        },
        { status: 400 },
      );
    }

    // Check if the locker is available
    const [existingLocker] = await db
      .select()
      .from(lockers)
      .where(eq(lockers.id, lockerId));

    if (!existingLocker) {
      return json({ message: "Locker not found" }, { status: 404 });
    }

    if (existingLocker.isOccupied) {
      // Check if the locker is already occupied by this user
      const [existingSubscription] = await db
        .select()
        .from(subscriptions)
        .where(
          and(
            eq(subscriptions.lockerId, lockerId),
            eq(subscriptions.status, "active"),
          ),
        );

      if (existingSubscription && existingSubscription.userId !== userId) {
        return json(
          { message: "Locker is already occupied by another user" },
          { status: 400 },
        );
      }
    }

    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (!existingUser) {
      return json({ message: "User not found" }, { status: 404 });
    }

    const subscriptionId = randomUUID();

    // Create a transaction
    await db.transaction(async (tx) => {
      // Create new subscription
      await tx.insert(subscriptions).values({
        id: subscriptionId,
        userId,
        lockerId,
        expiresAt,
        status: status as Status,
      });

      // Update locker status
      await tx
        .update(lockers)
        .set({
          isOccupied: true,
          userId,
        })
        .where(eq(lockers.id, lockerId));
    });

    // Verify the locker was updated correctly
    const [updatedLocker] = await db
      .select()
      .from(lockers)
      .where(eq(lockers.id, lockerId));

    return json({
      success: true,
      subscription: {
        id: subscriptionId,
        userId,
        lockerId,
        expiresAt,
        status,
      },
      locker: updatedLocker,
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    if (error instanceof Error) {
      return json({ message: error.message }, { status: 500 });
    }
    return json({ message: "Failed to create subscription" }, { status: 500 });
  }
};
