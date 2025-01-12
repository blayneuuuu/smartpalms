import {json} from "@sveltejs/kit";
import {error} from "@sveltejs/kit";
import type {AuthenticatedRequestHandler} from "../../types";
import {db} from "$lib/server/db";
import {lockerRequests, lockers} from "$lib/server/db/schema";
import {eq, and} from "drizzle-orm";
import {nanoid} from "nanoid";

export const POST: AuthenticatedRequestHandler = async ({request, locals}) => {
  const {lockerId} = await request.json();

  // Ensure user is authenticated
  const {userId} = locals.auth;
  if (!userId) {
    throw error(401, "Unauthorized");
  }

  try {
    // Check if locker exists and is available
    const locker = await db.query.lockers.findFirst({
      where: eq(lockers.id, lockerId),
    });

    if (!locker) {
      throw error(404, "Locker not found");
    }

    if (locker.userId) {
      throw error(400, "Locker is not available");
    }

    // Check if user already has a pending request for this locker
    const existingRequest = await db.query.lockerRequests.findFirst({
      where: (requests) =>
        and(
          eq(requests.userId, userId),
          eq(requests.lockerId, lockerId),
          eq(requests.status, "pending")
        ),
    });

    if (existingRequest) {
      throw error(400, "You already have a pending request for this locker");
    }

    // Create new request
    const newRequest = await db
      .insert(lockerRequests)
      .values({
        id: nanoid(),
        userId,
        lockerId,
        status: "pending",
        requestedAt: new Date(),
      })
      .returning();

    return json({request: newRequest[0]});
  } catch (err) {
    console.error("Error creating locker request:", err);
    if (err instanceof Error) {
      throw error(500, err.message);
    }
    throw error(500, "Failed to create request");
  }
};
