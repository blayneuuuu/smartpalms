import {json} from "@sveltejs/kit";
import {db} from "$lib/server/db";
import {lockers, accessHistory} from "$lib/server/db/schema";
import {eq, and, lte} from "drizzle-orm";
import type {RequestHandler} from "@sveltejs/kit";
import type {OTPAccessResponse} from "$lib/types/api";
import {APIErrors, handleError} from "$lib/server/errors";

export const GET: RequestHandler = async ({params}) => {
  try {
    const {otp} = params;

    if (!otp) {
      throw APIErrors.OTP.REQUIRED();
    }

    // Find locker with matching OTP and not expired
    const [locker] = await db
      .select()
      .from(lockers)
      .where(and(eq(lockers.otp, otp), lte(lockers.otpExpiresAt, new Date())));

    if (!locker) {
      // Create failed access history without user ID
      await db.insert(accessHistory).values({
        id: crypto.randomUUID(),
        lockerId: "unknown",
        accessType: "otp",
        otp,
        status: "failed",
      });

      throw APIErrors.OTP.INVALID();
    }

    // Create successful access history
    await db.insert(accessHistory).values({
      id: crypto.randomUUID(),
      lockerId: locker.id,
      accessType: "otp",
      otp,
      status: "success",
    });

    // Clear OTP after successful use
    await db
      .update(lockers)
      .set({
        otp: null,
        otpExpiresAt: null,
        lastAccessedAt: new Date(),
      })
      .where(eq(lockers.id, locker.id));

    const response: OTPAccessResponse = {
      success: true,
      locker: {id: locker.id, number: locker.number},
    };
    return json(response);
  } catch (err) {
    return handleError(err);
  }
};

// Using PATCH as it's more semantically correct for partial updates
export const PATCH: RequestHandler = async ({params}) => {
  try {
    const {otp} = params;

    if (!otp) {
      throw APIErrors.OTP.REQUIRED();
    }

    // Find and update locker with matching OTP
    const [locker] = await db
      .select()
      .from(lockers)
      .where(eq(lockers.otp, otp));

    if (!locker) {
      throw APIErrors.OTP.INVALID();
    }

    // Reset OTP to null
    await db.update(lockers).set({otp: null}).where(eq(lockers.id, locker.id));

    const response: OTPAccessResponse = {
      success: true,
      message: "OTP cleared successfully",
    };
    return json(response);
  } catch (err) {
    return handleError(err);
  }
};
