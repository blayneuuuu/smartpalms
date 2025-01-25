import { e as error, j as json } from "../../../../../../chunks/index.js";
import { d as db, b as subscriptions, l as lockers, a as lockerRequests, s as subscriptionTypes } from "../../../../../../chunks/index2.js";
import { eq, and } from "drizzle-orm";
const GET = async ({ params }) => {
  const userId = params.id;
  if (!userId) {
    throw error(400, "User ID is required");
  }
  try {
    const activeSubscriptions = await db.select({
      id: subscriptions.id,
      lockerId: subscriptions.lockerId,
      expiresAt: subscriptions.expiresAt,
      lockerNumber: lockers.number,
      lockerSize: lockers.size,
      status: subscriptions.status
    }).from(subscriptions).leftJoin(lockers, eq(subscriptions.lockerId, lockers.id)).where(
      and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.status, "active")
      )
    );
    const requests = await db.select({
      id: lockerRequests.id,
      lockerId: lockerRequests.lockerId,
      lockerNumber: lockers.number,
      lockerSize: lockers.size,
      status: lockerRequests.status,
      rejectionReason: lockerRequests.rejectionReason,
      requestedAt: lockerRequests.requestedAt,
      subscriptionName: subscriptionTypes.name,
      proofOfPayment: lockerRequests.proofOfPayment
    }).from(lockerRequests).leftJoin(lockers, eq(lockerRequests.lockerId, lockers.id)).leftJoin(
      subscriptionTypes,
      eq(lockerRequests.subscriptionTypeId, subscriptionTypes.id)
    ).where(eq(lockerRequests.userId, userId));
    return json({
      subscriptions: activeSubscriptions,
      requests,
      subscriptionsCount: activeSubscriptions.length,
      requestsCount: requests.length
    });
  } catch (err) {
    console.error("Error fetching user's lockers:", err);
    throw error(500, "Failed to fetch locker data");
  }
};
export {
  GET
};
