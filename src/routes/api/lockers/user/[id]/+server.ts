import {json} from "@sveltejs/kit";
import {error} from "@sveltejs/kit";
import type {RequestHandler} from "./$types";
import {db} from "$lib/server/db";
import {
  lockers,
  lockerRequests,
  subscriptionTypes,
} from "$lib/server/db/schema";
import {eq} from "drizzle-orm";
import {LockerService} from "$lib/services/core";

export const GET: RequestHandler = async ({params}) => {
  const userId = params.id;
  if (!userId) {
    throw error(400, "User ID is required");
  }

  try {
    // Get active subscriptions with detailed locker information using the LockerService
    const userLockers = await LockerService.getUserRentedLockers(userId);

    // Format the response with enhanced information
    const activeSubscriptions = userLockers.map(
      ({locker, subscription, daysUntilExpiration}) => ({
        id: subscription.id,
        lockerId: locker.id,
        expiresAt: subscription.expiresAt,
        lockerNumber: locker.number,
        lockerSize: locker.size,
        status: subscription.status,
        daysUntilExpiration,
        isExpiringSoon: daysUntilExpiration <= 3, // Flag for subscriptions expiring within 3 days
      })
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
      success: true,
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
