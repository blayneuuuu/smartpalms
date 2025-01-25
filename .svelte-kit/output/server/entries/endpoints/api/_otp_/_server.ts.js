import { e as error, j as json } from "../../../../chunks/index.js";
import { d as db, l as lockers, c as accessHistory } from "../../../../chunks/index2.js";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
const GET = async ({ params }) => {
  const otp = params.otp;
  if (!otp) {
    throw error(400, "OTP is required");
  }
  try {
    const locker = await db.select({
      id: lockers.id,
      number: lockers.number,
      otp: lockers.otp
    }).from(lockers).where(eq(lockers.otp, otp)).get();
    if (!locker) {
      await db.insert(accessHistory).values({
        id: randomUUID(),
        lockerId: "unknown",
        accessType: "otp",
        otp,
        status: "failed"
      });
      throw error(404, "Invalid or expired OTP");
    }
    await db.insert(accessHistory).values({
      id: randomUUID(),
      lockerId: locker.id,
      accessType: "otp",
      otp,
      status: "success"
    });
    return json({
      success: true,
      locker: {
        id: locker.id,
        number: locker.number
      }
    });
  } catch (err) {
    console.error("Error accessing locker with OTP:", err);
    throw error(500, "Internal server error");
  }
};
const PATCH = async ({ params }) => {
  const otp = params.otp;
  if (!otp) {
    throw error(400, "OTP is required");
  }
  try {
    const locker = await db.select().from(lockers).where(eq(lockers.otp, otp)).get();
    if (!locker) {
      await db.insert(accessHistory).values({
        id: randomUUID(),
        lockerId: "unknown",
        accessType: "otp",
        otp,
        status: "failed"
      });
      throw error(404, "Invalid or expired OTP");
    }
    await db.insert(accessHistory).values({
      id: randomUUID(),
      lockerId: locker.id,
      accessType: "otp",
      otp,
      status: "success"
    });
    await db.update(lockers).set({
      otp: null
    }).where(eq(lockers.id, locker.id));
    return json({
      success: true,
      message: "OTP cleared successfully"
    });
  } catch (err) {
    console.error("Error clearing OTP:", err);
    throw error(500, "Internal server error");
  }
};
export {
  GET,
  PATCH
};
