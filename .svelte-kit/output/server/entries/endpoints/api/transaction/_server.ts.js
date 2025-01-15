import { e as error, j as json } from "../../../../chunks/index.js";
import { d as db, t as transactions } from "../../../../chunks/index2.js";
const POST = async ({ request }) => {
  try {
    const { userId, amount, subscriptionId, proofOfPayment } = await request.json();
    if (!userId || !amount || !subscriptionId) {
      throw error(400, "Missing required fields");
    }
    const newTransaction = await db.insert(transactions).values({
      id: crypto.randomUUID(),
      userId,
      amount: amount.toString(),
      subscriptionId,
      status: "pending",
      proofOfPayment,
      createdAt: /* @__PURE__ */ new Date()
    }).returning();
    return json({ success: true, transaction: newTransaction[0] });
  } catch (err) {
    console.error("Error creating transaction:", err);
    if (err instanceof Error) {
      throw error(500, err.message);
    }
    throw error(500, "Failed to create transaction");
  }
};
export {
  POST
};
