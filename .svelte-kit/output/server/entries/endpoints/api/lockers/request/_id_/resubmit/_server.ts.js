import { e as error, j as json } from "../../../../../../../chunks/index.js";
import { d as db, a as lockerRequests } from "../../../../../../../chunks/index2.js";
import { eq } from "drizzle-orm";
const POST = async ({ params, request, locals }) => {
  const userId = locals.auth?.userId;
  if (!userId) {
    throw error(401, "Unauthorized");
  }
  const requestId = params.id;
  if (!requestId) {
    throw error(400, "Request ID is required");
  }
  try {
    const lockerRequest = await db.select().from(lockerRequests).where(eq(lockerRequests.id, requestId)).get();
    if (!lockerRequest) {
      throw error(404, "Request not found");
    }
    if (lockerRequest.userId !== userId) {
      throw error(403, "You don't have access to this request");
    }
    if (lockerRequest.status !== "rejected") {
      throw error(400, "Only rejected requests can be resubmitted");
    }
    const { proofOfPayment } = await request.json();
    await db.update(lockerRequests).set({
      status: "pending",
      rejectionReason: null,
      processedAt: null,
      processedBy: null,
      ...proofOfPayment ? { proofOfPayment } : {}
    }).where(eq(lockerRequests.id, requestId));
    return json({ success: true });
  } catch (err) {
    console.error("Error resubmitting request:", err);
    throw error(500, "Failed to resubmit request");
  }
};
export {
  POST
};
