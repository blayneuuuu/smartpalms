import {json, error} from "@sveltejs/kit";
import {verifyUser} from "$lib/server/auth";
import {db} from "$lib/server/db";
import {subscriptions, lockers} from "$lib/server/db/schema";
import {eq, and} from "drizzle-orm";
import {loginSchema} from "$lib/types";
import type {RequestHandler} from "./$types";

export const POST: RequestHandler = async ({request}) => {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      const {errors} = result.error;
      throw error(400, errors[0].message);
    }

    const user = await verifyUser(result.data.email, result.data.password);
    if (!user) {
      throw error(401, "Invalid credentials");
    }

    // Get all active subscriptions for the user with their associated lockers
    const userLockers = await db
      .select({
        id: lockers.id,
        number: lockers.number,
        size: lockers.size,
        subscription: {
          id: subscriptions.id,
          status: subscriptions.status,
          expiresAt: subscriptions.expiresAt,
        },
      })
      .from(lockers)
      .innerJoin(subscriptions, eq(lockers.id, subscriptions.lockerId))
      .where(
        and(
          eq(subscriptions.userId, user.id),
          eq(subscriptions.status, "active")
        )
      );

    return json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      lockers: userLockers,
    });
  } catch (err) {
    console.error("External API error:", err);
    if (err instanceof Error) {
      throw error(500, err.message);
    }
    throw error(500, "Internal server error");
  }
};
