import { json } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/server/db";
import { lockers, accessHistory } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export const GET: RequestHandler = async ({ params }) => {
  const otp = params.otp;
  if (!otp) {
    throw error(400, "OTP is required");
  }

  try {
    // Find locker with matching OTP
    const locker = await db
      .select({
        id: lockers.id,
        number: lockers.number,
        otp: lockers.otp,
      })
      .from(lockers)
      .where(eq(lockers.otp, otp))
      .get();

    if (!locker) {
      // Log failed access attempt
      await db.insert(accessHistory).values({
        id: randomUUID(),
        lockerId: "unknown",
        accessType: "otp",
        otp,
        status: "failed",
      });

      throw error(404, "Invalid or expired OTP");
    }

    // Log successful access
    await db.insert(accessHistory).values({
      id: randomUUID(),
      lockerId: locker.id,
      accessType: "otp",
      otp,
      status: "success",
    });

    // Clear the OTP after successful access

    return json({
      success: true,
      locker: {
        id: locker.id,
        number: locker.number,
      },
    });
  } catch (err) {
    console.error("Error accessing locker with OTP:", err);
    throw error(500, "Internal server error");
  }
};

// Using PATCH as it's more semantically correct for partial updates
export const PATCH: RequestHandler = async ({ params }) => {
  const otp = params.otp;
  if (!otp) {
    throw error(400, "OTP is required");
  }

  try {
    // Find and update locker with matching OTP
    const locker = await db
      .select()
      .from(lockers)
      .where(eq(lockers.otp, otp))
      .get();

    if (!locker) {
      // Log failed access attempt
      await db.insert(accessHistory).values({
        id: randomUUID(),
        lockerId: "unknown",
        accessType: "otp",
        otp,
        status: "failed",
      });

      throw error(404, "Invalid or expired OTP");
    }

    // Log successful access
    await db.insert(accessHistory).values({
      id: randomUUID(),
      lockerId: locker.id,
      accessType: "otp",
      otp,
      status: "success",
    });

    // Reset OTP to null
    await db
      .update(lockers)
      .set({
        otp: null,
      })
      .where(eq(lockers.id, locker.id));

    return json({
      success: true,
      message: "OTP cleared successfully",
    });
  } catch (err) {
    console.error("Error clearing OTP:", err);
    throw error(500, "Internal server error");
  }
};
