import { j as json } from "../../../../chunks/index.js";
import { d as db, l as lockers } from "../../../../chunks/index2.js";
import { eq } from "drizzle-orm";
const GET = async ({ params }) => {
  try {
    const otp = params.otp;
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
const PATCH = async ({ params }) => {
  try {
    const otp = params.otp;
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
export { GET, PATCH };
