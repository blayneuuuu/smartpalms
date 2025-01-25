import { e as error, j as json } from "../../../../../../chunks/index.js";
import { d as db, l as lockers } from "../../../../../../chunks/index2.js";
import { eq } from "drizzle-orm";
const POST = async ({ params, locals }) => {
  if (!locals.user) {
    throw error(401, "Unauthorized");
  }
  const lockerId = params.id;
  if (!lockerId) {
    throw error(400, "Locker ID is required");
  }
  try {
    const locker = await db.select().from(lockers).where(eq(lockers.id, lockerId)).get();
    if (!locker) {
      throw error(404, "Locker not found");
    }
    if (locker.userId !== locals.user.id) {
      throw error(403, "You don't have access to this locker");
    }
    const otp = Math.floor(1e5 + Math.random() * 9e5).toString();
    await db.update(lockers).set({
      otp
    }).where(eq(lockers.id, lockerId));
    const expiryDate = /* @__PURE__ */ new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 5);
    return json({
      otp,
      expiryDate
    });
  } catch (err) {
    console.error("Error generating OTP:", err);
    throw error(500, "Failed to generate OTP");
  }
};
export {
  POST
};
