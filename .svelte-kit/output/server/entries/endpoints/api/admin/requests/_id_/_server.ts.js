import { e as error, j as json } from "../../../../../../chunks/index.js";
import { d as db, l as lockerRequests, s as subscriptions, t as transactions, b as lockers } from "../../../../../../chunks/index2.js";
import { eq } from "drizzle-orm";
const PUT = async ({ params, request, locals }) => {
  const { userId } = locals.auth;
  if (!userId) {
    throw error(401, "Unauthorized");
  }
  const requestId = params.id;
  if (!requestId) {
    throw error(400, "Request ID is required");
  }
  try {
    const { status, rejectionReason } = await request.json();
    const lockerRequest = await db.query.lockerRequests.findFirst({
      where: eq(lockerRequests.id, requestId)
    });
    if (!lockerRequest) {
      throw error(404, "Request not found");
    }
    if (status === "approved") {
      const subscription = await db.insert(subscriptions).values({
        id: crypto.randomUUID(),
        userId: lockerRequest.userId,
        lockerId: lockerRequest.lockerId,
        status: "active",
        createdAt: /* @__PURE__ */ new Date(),
        expiresAt: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1e3
        ).toISOString()
        // 30 days from now
      }).returning();
      await db.insert(transactions).values({
        id: crypto.randomUUID(),
        userId: lockerRequest.userId,
        amount: "29.99",
        // You might want to make this configurable
        subscriptionId: subscription[0].id,
        status: "success",
        proofOfPayment: lockerRequest.proofOfPayment,
        createdAt: /* @__PURE__ */ new Date()
      });
      await db.update(lockers).set({
        userId: lockerRequest.userId,
        isOccupied: true,
        lastAccessedAt: /* @__PURE__ */ new Date()
      }).where(eq(lockers.id, lockerRequest.lockerId));
      await db.delete(lockerRequests).where(eq(lockerRequests.id, requestId));
    } else if (status === "rejected") {
      await db.update(lockerRequests).set({
        status: "rejected",
        rejectionReason: rejectionReason || "No reason provided",
        processedAt: /* @__PURE__ */ new Date(),
        processedBy: userId
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
