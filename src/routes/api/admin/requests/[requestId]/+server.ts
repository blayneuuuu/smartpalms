import {json} from "@sveltejs/kit";
import {error} from "@sveltejs/kit";
import type {AuthenticatedRequestHandler} from "../../../types";
import {db} from "$lib/server/db";
import {lockerRequests, lockers, admins} from "$lib/server/db/schema";
import {eq} from "drizzle-orm";

export const POST: AuthenticatedRequestHandler = async ({
  params,
  request,
  locals,
}) => {
  const {requestId} = params;
  const {action} = await request.json();
  const {userId} = locals.auth;

  if (!userId) {
    throw error(401, "Unauthorized");
  }

  // Verify admin status
  const admin = await db.query.admins.findFirst({
    where: eq(admins.userId, userId),
  });

  if (!admin) {
    throw error(403, "Forbidden - Admin access required");
  }

  if (!["approve", "reject"].includes(action)) {
    throw error(400, 'Invalid action. Must be either "approve" or "reject"');
  }

  try {
    // Start a transaction
    return await db.transaction(async (tx) => {
      // Get the request
      const lockerRequest = await tx.query.lockerRequests.findFirst({
        where: eq(lockerRequests.id, requestId),
      });

      if (!lockerRequest) {
        throw error(404, "Request not found");
      }

      if (lockerRequest.status !== "pending") {
        throw error(400, "Request has already been processed");
      }

      // Get the locker
      const locker = await tx.query.lockers.findFirst({
        where: eq(lockers.id, lockerRequest.lockerId),
      });

      if (!locker) {
        throw error(404, "Locker not found");
      }

      if (locker.userId && action === "approve") {
        throw error(400, "Locker is no longer available");
      }

      // Update the request
      await tx
        .update(lockerRequests)
        .set({
          status: action === "approve" ? "approved" : "rejected",
          processedAt: new Date(),
          processedBy: admin.id,
        })
        .where(eq(lockerRequests.id, requestId));

      // If approved, update the locker
      if (action === "approve") {
        await tx
          .update(lockers)
          .set({
            userId: lockerRequest.userId,
            isOccupied: true,
          })
          .where(eq(lockers.id, lockerRequest.lockerId));
      }

      return json({
        success: true,
        message: `Request ${action === "approve" ? "approved" : "rejected"} successfully`,
      });
    });
  } catch (err) {
    console.error("Error processing request:", err);
    if (err instanceof Error) {
      throw error(500, err.message);
    }
    throw error(500, "Failed to process request");
  }
};
