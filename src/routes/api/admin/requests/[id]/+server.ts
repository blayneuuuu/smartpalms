import {json} from "@sveltejs/kit";
import {error} from "@sveltejs/kit";
import type {RequestHandler} from "./$types";
import {db} from "$lib/server/db";
import {
  lockerRequests,
  lockers,
  subscriptions,
  transactions,
} from "$lib/server/db/schema";
import {eq} from "drizzle-orm";

export const PUT: RequestHandler = async ({params, request, locals}) => {
  const {userId} = locals.auth;
  if (!userId) {
    throw error(401, "Unauthorized");
  }

  const requestId = params.id;
  if (!requestId) {
    throw error(400, "Request ID is required");
  }

  try {
    const {status, rejectionReason} = await request.json();

    // Get the request details
    const lockerRequest = await db.query.lockerRequests.findFirst({
      where: eq(lockerRequests.id, requestId),
    });

    if (!lockerRequest) {
      throw error(404, "Request not found");
    }

    if (status === "approved") {
      // Create subscription
      const subscription = await db
        .insert(subscriptions)
        .values({
          id: crypto.randomUUID(),
          userId: lockerRequest.userId,
          lockerId: lockerRequest.lockerId,
          status: "active",
          createdAt: new Date(),
          expiresAt: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(), // 30 days from now
        })
        .returning();

      // Create transaction
      await db.insert(transactions).values({
        id: crypto.randomUUID(),
        userId: lockerRequest.userId,
        amount: "29.99", // You might want to make this configurable
        subscriptionId: subscription[0].id,
        status: "success",
        proofOfPayment: lockerRequest.proofOfPayment,
        createdAt: new Date(),
      });

      // Update locker status
      await db
        .update(lockers)
        .set({
          userId: lockerRequest.userId,
          isOccupied: true,
          lastAccessedAt: new Date(),
        })
        .where(eq(lockers.id, lockerRequest.lockerId));

      // Delete the request
      await db.delete(lockerRequests).where(eq(lockerRequests.id, requestId));
    } else if (status === "rejected") {
      // Update request status and add rejection reason
      await db
        .update(lockerRequests)
        .set({
          status: "rejected",
          rejectionReason: rejectionReason || "No reason provided",
          processedAt: new Date(),
          processedBy: userId,
        })
        .where(eq(lockerRequests.id, requestId));
    }

    return json({success: true});
  } catch (err) {
    console.error("Error processing request:", err);
    if (err instanceof Error) {
      throw error(500, err.message);
    }
    throw error(500, "Failed to process request");
  }
};
