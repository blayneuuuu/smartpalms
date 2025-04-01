import { json } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/server/db";
import { transactions } from "$lib/server/db/schema";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { userId, amount, subscriptionId, proofOfPayment } =
      await request.json();

    if (!userId || !amount || !subscriptionId) {
      throw error(400, "Missing required fields");
    }

    // Create new transaction
    const newTransaction = await db
      .insert(transactions)
      .values({
        id: crypto.randomUUID(),
        userId,
        amount: amount.toString(),
        subscriptionId,
        status: "pending",
        proofOfPayment,
        createdAt: new Date(),
      })
      .returning();

    return json({ success: true, transaction: newTransaction[0] });
  } catch (err) {
    console.error("Error creating transaction:", err);
    if (err instanceof Error) {
      throw error(500, err.message);
    }
    throw error(500, "Failed to create transaction");
  }
};
