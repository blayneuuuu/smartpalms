import { json } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/server/db";
import { lockers } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

export const POST: RequestHandler = async ({ params, locals }) => {
  if (!locals.user) {
    throw error(401, "Unauthorized");
  }

  const lockerId = params.id;
  if (!lockerId) {
    throw error(400, "Locker ID is required");
  }

  try {
    // Get the locker and verify ownership
    const locker = await db
      .select()
      .from(lockers)
      .where(eq(lockers.id, lockerId))
      .get();

    if (!locker) {
      throw error(404, "Locker not found");
    }

    if (locker.userId !== locals.user.id) {
      throw error(403, "You don't have access to this locker");
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Update the locker with new OTP
    await db
      .update(lockers)
      .set({
        otp,
      })
      .where(eq(lockers.id, lockerId));

    // Get the expiry time for the response
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 5);

    return json({
      otp,
      expiryDate,
    });
  } catch (err) {
    console.error("Error generating OTP:", err);
    throw error(500, "Failed to generate OTP");
  }
};
