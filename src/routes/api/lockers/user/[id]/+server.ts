import {json} from "@sveltejs/kit";
import {error} from "@sveltejs/kit";
import type {RequestHandler} from "./$types";
import {db} from "$lib/server/db";
import {
  subscriptions,
  lockers,
  lockerRequests,
  subscriptionTypes,
} from "$lib/server/db/schema";
import {eq, and} from "drizzle-orm";

export const GET: RequestHandler = async ({params}) => {
  const userId = params.id;
  if (!userId) {
    throw error(400, "User ID is required");
  }

  try {
    // Get active subscriptions with locker details
    const activeSubscriptions = await db
      .select({
        id: subscriptions.id,
        lockerId: subscriptions.lockerId,
        expiresAt: subscriptions.expiresAt,
        lockerNumber: lockers.number,
        lockerSize: lockers.size,
        status: subscriptions.status,
      })
      .from(subscriptions)
      .leftJoin(lockers, eq(subscriptions.lockerId, lockers.id))
      .where(
        and(
          eq(subscriptions.userId, userId),
          eq(subscriptions.status, "active")
        )
      );

    // Get locker requests with details
    const requests = await db
      .select({
        id: lockerRequests.id,
        lockerId: lockerRequests.lockerId,
        lockerNumber: lockers.number,
        lockerSize: lockers.size,
        status: lockerRequests.status,
        rejectionReason: lockerRequests.rejectionReason,
        requestedAt: lockerRequests.requestedAt,
        subscriptionName: subscriptionTypes.name,
        proofOfPayment: lockerRequests.proofOfPayment,
      })
      .from(lockerRequests)
      .leftJoin(lockers, eq(lockerRequests.lockerId, lockers.id))
      .leftJoin(
        subscriptionTypes,
        eq(lockerRequests.subscriptionTypeId, subscriptionTypes.id)
      )
      .where(eq(lockerRequests.userId, userId));

    return json({
      subscriptions: activeSubscriptions,
      requests: requests,
      subscriptionsCount: activeSubscriptions.length,
      requestsCount: requests.length,
    });
  } catch (err) {
    console.error("Error fetching user's lockers:", err);
    throw error(500, "Failed to fetch locker data");
  }
};
