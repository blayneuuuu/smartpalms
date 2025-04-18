import {error, json} from "@sveltejs/kit";
import {db} from "$lib/server/db";
import {
  lockerRequests,
  lockers,
  subscriptionTypes,
} from "$lib/server/db/schema";
import type {RequestHandler} from "./$types";
import {nanoid} from "nanoid";
import {eq, and} from "drizzle-orm";
import {directClient} from "$lib/db/direct-client";

export const POST: RequestHandler = async ({locals, request}) => {
  if (!locals.user) {
    throw error(401, "Unauthorized");
  }

  const body = await request.json();
  const {lockerId, subscriptionTypeId, proofOfPayment} = body;

  if (!lockerId || !subscriptionTypeId || !proofOfPayment) {
    throw error(400, "Missing required fields");
  }

  try {
    // Check for schema issues first
    try {
      // Verify subscription_types table
      const subTypesCount = await directClient.execute({
        sql: `SELECT COUNT(*) as count FROM subscription_types WHERE id = ?`,
        args: [subscriptionTypeId],
      });

      if (!subTypesCount.rows[0].count) {
        throw error(
          400,
          `Subscription type not found (ID: ${subscriptionTypeId})`
        );
      }

      // Verify locker
      const lockerCheck = await directClient.execute({
        sql: `SELECT COUNT(*) as count FROM lockers WHERE id = ?`,
        args: [lockerId],
      });

      if (!lockerCheck.rows[0].count) {
        throw error(404, "Locker not found");
      }
    } catch (schemaError: unknown) {
      console.error("Schema verification error:", schemaError);
      // If it's a "no such table" error, it's likely a schema issue
      if (
        typeof schemaError === "object" &&
        schemaError !== null &&
        "message" in schemaError &&
        typeof schemaError.message === "string" &&
        schemaError.message.includes("no such table")
      ) {
        return json(
          {
            success: false,
            message: "Database schema issue detected. Please contact support.",
            error: "Database migration issue",
          },
          {status: 500}
        );
      }
    }

    // Check if locker exists and is available
    const locker = await db
      .select()
      .from(lockers)
      .where(eq(lockers.id, lockerId))
      .get();

    if (!locker) {
      throw error(404, "Locker not found");
    }

    if (locker.isOccupied) {
      throw error(400, "This locker is already occupied");
    }

    // Check if there's already a pending request for this locker
    try {
      const existingRequest = await db
        .select()
        .from(lockerRequests)
        .where(
          and(
            eq(lockerRequests.lockerId, lockerId),
            eq(lockerRequests.status, "pending")
          )
        )
        .get();

      if (existingRequest) {
        throw error(400, "There is already a pending request for this locker");
      }
    } catch (queryError: unknown) {
      console.error("Error checking existing requests:", queryError);
      // If there's a schema issue, handle it gracefully
      if (
        typeof queryError === "object" &&
        queryError !== null &&
        "message" in queryError &&
        typeof queryError.message === "string" &&
        queryError.message.includes("no such table")
      ) {
        return json(
          {
            success: false,
            message: "Database schema issue detected. Please contact support.",
            error: "Database migration issue",
          },
          {status: 500}
        );
      }
      throw queryError; // rethrow if it's not a schema issue
    }

    // Validate the subscription type
    try {
      const subType = await db
        .select()
        .from(subscriptionTypes)
        .where(eq(subscriptionTypes.id, subscriptionTypeId))
        .get();

      if (!subType) {
        throw error(400, "Invalid subscription type");
      }

      if (!subType.isActive) {
        throw error(400, "This subscription type is no longer available");
      }

      // Make sure the subscription size matches the locker size
      if (subType.size !== locker.size) {
        throw error(
          400,
          `This subscription is for ${subType.size} lockers but you selected a ${locker.size} locker`
        );
      }
    } catch (subTypeError: unknown) {
      console.error("Error validating subscription type:", subTypeError);
      // Handle schema issues gracefully
      if (
        typeof subTypeError === "object" &&
        subTypeError !== null &&
        "message" in subTypeError &&
        typeof subTypeError.message === "string" &&
        subTypeError.message.includes("no such table")
      ) {
        return json(
          {
            success: false,
            message: "Database schema issue detected. Please contact support.",
            error: "Database migration issue",
          },
          {status: 500}
        );
      }
      throw subTypeError; // rethrow if it's not a schema issue
    }

    // Create locker request - using direct SQL to avoid schema issues
    const requestId = nanoid();
    const userId = locals.user.id;
    const now = Math.floor(Date.now() / 1000); // Unix timestamp

    try {
      await directClient.execute({
        sql: `
          INSERT INTO locker_requests (
            id, user_id, locker_id, subscription_type_id, 
            status, proof_of_payment, requested_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          requestId,
          userId,
          lockerId,
          subscriptionTypeId,
          "pending",
          proofOfPayment,
          now,
        ],
      });

      return json(
        {
          success: true,
          message: "Locker request submitted successfully",
          requestId,
        },
        {status: 201}
      );
    } catch (insertError) {
      console.error("Error inserting locker request:", insertError);
      throw error(500, "Failed to create locker request. Please try again.");
    }
  } catch (err) {
    console.error("Error creating locker request:", err);
    if (err instanceof Error) {
      throw error(500, err.message);
    }
    throw error(500, "Failed to create locker request");
  }
};
