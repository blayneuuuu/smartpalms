import { e as error } from "../../../../../chunks/index.js";
import { d as db, l as lockers, a as lockerRequests } from "../../../../../chunks/index2.js";
import { nanoid } from "nanoid";
import { eq, and } from "drizzle-orm";
const POST = async ({ locals, request }) => {
  if (!locals.user) {
    throw error(401, "Unauthorized");
  }
  const body = await request.json();
  const { lockerId, subscriptionTypeId, proofOfPayment } = body;
  if (!lockerId || !subscriptionTypeId || !proofOfPayment) {
    throw error(400, "Missing required fields");
  }
  try {
    const locker = await db.select().from(lockers).where(eq(lockers.id, lockerId)).get();
    if (!locker) {
      throw error(404, "Locker not found");
    }
    const existingRequest = await db.select().from(lockerRequests).where(
      and(
        eq(lockerRequests.lockerId, lockerId),
        eq(lockerRequests.status, "pending")
      )
    ).get();
    if (existingRequest) {
      throw error(400, "There is already a pending request for this locker");
    }
    const newRequest = {
      id: nanoid(),
      userId: locals.user.id,
      lockerId,
      subscriptionTypeId,
      proofOfPayment,
      status: "pending",
      requestedAt: /* @__PURE__ */ new Date()
    };
    await db.insert(lockerRequests).values(newRequest);
    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (err) {
    console.error("Error creating locker request:", err);
    if (err instanceof Error) {
      throw error(500, err.message);
    }
    throw error(500, "Failed to create locker request");
  }
};
export {
  POST
};
