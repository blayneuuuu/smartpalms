import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/server/db";
import { lockers } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

export const GET: RequestHandler = async ({ params }) => {
  try {
    const otp = params.otp;

    // Find locker with matching OTP
    const locker = await db
      .select()
      .from(lockers)
      .where(eq(lockers.otp, otp))
      .get();

    if (!locker) {
      return json(
        {
          success: false,
          message: "Invalid OTP",
        },
        { status: 404 },
      );
    }

    return json({
      success: true,
      data: {
        number: locker.number,
        size: locker.size,
      },
    });
  } catch (error) {
    console.error("Error fetching locker by OTP:", error);
    return json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 },
    );
  }
};

// Using PATCH as it's more semantically correct for partial updates
export const PATCH: RequestHandler = async ({ params }) => {
  try {
    const otp = params.otp;

    // Find and update locker with matching OTP
    const locker = await db
      .select()
      .from(lockers)
      .where(eq(lockers.otp, otp))
      .get();

    if (!locker) {
      return json(
        {
          success: false,
          message: "Invalid OTP",
        },
        { status: 404 },
      );
    }

    // Reset OTP to null
    await db
      .update(lockers)
      .set({ otp: null })
      .where(eq(lockers.id, locker.id))
      .run();

    return json({
      success: true,
      message: "OTP cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing OTP:", error);
    return json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 },
    );
  }
};
