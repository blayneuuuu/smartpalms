import { e as error, j as json } from "../../../../../../chunks/index.js";
import { d as db, a as lockerRequests, s as subscriptionTypes, l as lockers, b as subscriptions, t as transactions } from "../../../../../../chunks/index2.js";
import { eq, and } from "drizzle-orm";
const PUT = async ({ params, request, locals }) => {
  if (!locals.user || locals.user.type !== "admin") {
    throw error(401, "Unauthorized");
  }
  const requestId = params.id;
  if (!requestId) {
    throw error(400, "Request ID is required");
  }
  try {
    const { status, rejectionReason } = await request.json();
    const lockerRequest = await db.select().from(lockerRequests).where(eq(lockerRequests.id, requestId)).get();
    if (!lockerRequest) {
      throw error(404, "Request not found");
    }
    const subscriptionType = await db.select().from(subscriptionTypes).where(eq(subscriptionTypes.id, lockerRequest.subscriptionTypeId)).get();
    if (!subscriptionType) {
      throw error(404, "Subscription type not found");
    }
    const locker = await db.select().from(lockers).where(eq(lockers.id, lockerRequest.lockerId)).get();
    if (!locker) {
      throw error(404, "Locker not found");
    }
    if (status === "approve") {
      const [existingSubscription] = await db.select().from(subscriptions).where(
        and(
          eq(subscriptions.lockerId, lockerRequest.lockerId),
          eq(subscriptions.status, "active")
        )
      );
      if (existingSubscription) {
        throw error(400, "Locker is no longer available");
      }
      let daysToAdd = 0;
      switch (subscriptionType.duration) {
        case "1_day":
          daysToAdd = 1;
          break;
        case "7_days":
          daysToAdd = 7;
          break;
        case "30_days":
          daysToAdd = 30;
          break;
        default:
          throw error(400, "Invalid subscription duration");
      }
      const expiryDate = /* @__PURE__ */ new Date();
      expiryDate.setDate(expiryDate.getDate() + daysToAdd);
      const [subscription] = await db.insert(subscriptions).values({
        id: crypto.randomUUID(),
        userId: lockerRequest.userId,
        lockerId: lockerRequest.lockerId,
        status: "active",
        expiresAt: expiryDate.toISOString(),
        createdAt: /* @__PURE__ */ new Date()
      }).returning();
      await db.insert(transactions).values({
        id: crypto.randomUUID(),
        userId: lockerRequest.userId,
        amount: subscriptionType.amount.toString(),
        subscriptionId: subscription.id,
        status: "success",
        proofOfPayment: lockerRequest.proofOfPayment,
        createdAt: /* @__PURE__ */ new Date()
      });
      await db.update(lockers).set({
        userId: lockerRequest.userId,
        isOccupied: true
      }).where(eq(lockers.id, lockerRequest.lockerId));
      await db.update(lockerRequests).set({
        status: "approved",
        processedAt: /* @__PURE__ */ new Date(),
        processedBy: locals.user.id
      }).where(eq(lockerRequests.id, requestId));
      await db.delete(lockerRequests).where(eq(lockerRequests.id, requestId));
    } else if (status === "reject") {
      await db.update(lockerRequests).set({
        status: "rejected",
        rejectionReason: rejectionReason || "No reason provided",
        processedAt: /* @__PURE__ */ new Date(),
        processedBy: locals.user.id
      }).where(eq(lockerRequests.id, requestId));
    }
    return json({ success: true });
  } catch (err) {
    console.error("Error processing request:", err);
    if (err instanceof Error) {
      throw error(500, err.message);
    }
    throw error(500, "Failed to process request");
  }
};
export {
  PUT
};
