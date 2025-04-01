import {json} from "@sveltejs/kit";
import type {RequestHandler} from "@sveltejs/kit";
import {db} from "$lib/server/db";
import {subscriptions, lockers, users} from "$lib/server/db/schema";
import {eq} from "drizzle-orm";
import {dev} from "$app/environment";

/**
 * Test endpoint to create a subscription that expires today
 * This helps with testing the cron job that sends expiration notifications
 * Only available in development mode
 */
export const GET: RequestHandler = async () => {
  try {
    // Only allow in development mode
    if (!dev) {
      return json(
        {
          success: false,
          message: "This endpoint is only available in development mode",
        },
        {status: 403}
      );
    }

    console.log("Creating a test subscription that expires today...");

    // Get a random user (first one for simplicity)
    const user = await db.select().from(users).limit(1).get();
    if (!user) {
      return json(
        {
          success: false,
          message: "No users found in the database",
        },
        {status: 404}
      );
    }

    // Find an unoccupied locker
    const locker = await db
      .select()
      .from(lockers)
      .where(eq(lockers.isOccupied, false))
      .limit(1)
      .get();

    if (!locker) {
      return json(
        {
          success: false,
          message: "No unoccupied lockers found in the database",
        },
        {status: 404}
      );
    }

    // Create today's date at the current time (expires in a few hours)
    const today = new Date();
    // Format to ISO string for SQLite
    const expiresAt = today.toISOString();

    // Create a subscription that expires today
    const [subscription] = await db
      .insert(subscriptions)
      .values({
        id: crypto.randomUUID(),
        userId: user.id,
        lockerId: locker.id,
        status: "active",
        expiresAt: expiresAt,
      })
      .returning();

    // Update the locker to show it's occupied
    await db
      .update(lockers)
      .set({
        isOccupied: true,
        userId: user.id,
      })
      .where(eq(lockers.id, locker.id));

    console.log(`Created test subscription that expires at ${expiresAt}`);

    return json({
      success: true,
      message: "Test subscription created successfully",
      subscription,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      locker: {
        id: locker.id,
        number: locker.number,
        size: locker.size,
      },
      expiresAt,
    });
  } catch (error) {
    console.error("Error creating test subscription:", error);

    return json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      {status: 500}
    );
  }
};
