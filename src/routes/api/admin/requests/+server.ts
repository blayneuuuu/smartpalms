import {json} from "@sveltejs/kit";
import type {RequestHandler} from "./$types";
import {db} from "$lib/server/db";
import {
  lockerRequests,
  lockers,
  users,
  subscriptionTypes,
  subscriptions,
} from "$lib/server/db/schema";
import {eq} from "drizzle-orm";
import {randomUUID} from "crypto";

export const GET: RequestHandler = async ({locals}) => {
  try {
    if (!locals.user || locals.user.type !== "admin") {
      return json(
        {authenticated: false, message: "User is not an admin."},
        {status: 403}
      );
    }

    const requests = await db
      .select({
        id: lockerRequests.id,
        userId: lockerRequests.userId,
        userName: users.name,
        lockerId: lockerRequests.lockerId,
        lockerNumber: lockers.number,
        lockerSize: lockers.size,
        status: lockerRequests.status,
        requestedAt: lockerRequests.requestedAt,
        rejectionReason: lockerRequests.rejectionReason,
        subscriptionName: subscriptionTypes.name,
        subscriptionTypeId: lockerRequests.subscriptionTypeId,
        proofOfPayment: lockerRequests.proofOfPayment,
      })
      .from(lockerRequests)
      .leftJoin(users, eq(lockerRequests.userId, users.id))
      .leftJoin(lockers, eq(lockerRequests.lockerId, lockers.id))
      .leftJoin(
        subscriptionTypes,
        eq(lockerRequests.subscriptionTypeId, subscriptionTypes.id)
      )
      .orderBy(lockerRequests.requestedAt);

    return json({requests});
  } catch (error) {
    console.error("Error fetching requests:", error);
    return json({message: "Failed to fetch requests"}, {status: 500});
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

    const {requestId, action, rejectionReason} = await request.json();

    if (!requestId || !action || (action === "reject" && !rejectionReason)) {
      return json({message: "Missing required fields"}, {status: 400});
    }

    // Get the request details
    const [lockerRequest] = await db
      .select()
      .from(lockerRequests)
      .where(eq(lockerRequests.id, requestId));

    if (!lockerRequest) {
      return json({message: "Request not found"}, {status: 404});
    }

    if (lockerRequest.status !== "pending") {
      return json({message: "Request is not pending"}, {status: 400});
    }

    // Check if locker is still available
    const [locker] = await db
      .select()
      .from(lockers)
      .where(eq(lockers.id, lockerRequest.lockerId));

    if (!locker) {
      return json({message: "Locker not found"}, {status: 404});
    }

    if (locker.isOccupied) {
      return json({message: "Locker is already occupied"}, {status: 400});
    }

    if (action === "approve") {
      // Get subscription type details
      const [subscriptionType] = await db
        .select()
        .from(subscriptionTypes)
        .where(eq(subscriptionTypes.id, lockerRequest.subscriptionTypeId));

      if (!subscriptionType) {
        return json({message: "Subscription type not found"}, {status: 404});
      }

      // Calculate subscription dates
      const endDate = new Date();
      switch (subscriptionType.duration) {
        case "1_day":
          endDate.setDate(endDate.getDate() + 1);
          break;
        case "7_days":
          endDate.setDate(endDate.getDate() + 7);
          break;
        case "30_days":
          endDate.setDate(endDate.getDate() + 30);
          break;
      }

      // Create subscription
      await db.insert(subscriptions).values({
        id: randomUUID(),
        userId: lockerRequest.userId,
        lockerId: lockerRequest.lockerId,
        status: "active",
        expiresAt: endDate.toISOString(),
        createdAt: new Date(),
      });

      // Update locker status
      await db
        .update(lockers)
        .set({isOccupied: true, userId: lockerRequest.userId})
        .where(eq(lockers.id, lockerRequest.lockerId));

      // Update request status
      await db
        .update(lockerRequests)
        .set({
          status: "approved",
          processedAt: new Date(),
          processedBy: locals.user.id,
        })
        .where(eq(lockerRequests.id, requestId));
    } else {
      // Delete request on rejection
      await db.delete(lockerRequests).where(eq(lockerRequests.id, requestId));
    }

    return json({success: true});
  } catch (error) {
    console.error("Error processing request:", error);
    return json({message: "Failed to process request"}, {status: 500});
  }
};
