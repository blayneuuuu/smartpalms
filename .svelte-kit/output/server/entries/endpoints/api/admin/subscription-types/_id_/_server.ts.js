import { j as json } from "../../../../../../chunks/index.js";
import { d as db, s as subscriptionTypes } from "../../../../../../chunks/index2.js";
import { eq } from "drizzle-orm";
import { z } from "zod";
const subscriptionTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  duration: z.enum(["1_day", "7_days", "30_days"], {
    required_error: "Duration is required",
    invalid_type_error: "Invalid duration"
  }),
  amount: z.number().min(0, "Amount must be greater than or equal to 0")
});
const PUT = async ({ request, locals, params }) => {
  try {
    if (!locals.user || locals.user.type !== "admin") {
      return json(
        { authenticated: false, message: "User is not an admin." },
        { status: 403 }
      );
    }
    const { id } = params;
    if (!id) {
      return json({ message: "Subscription type ID is required" }, { status: 400 });
    }
    const body = await request.json();
    const result = subscriptionTypeSchema.safeParse(body);
    if (!result.success) {
      const { errors } = result.error;
      return json({ message: errors[0].message }, { status: 400 });
    }
    const { name, duration, amount } = result.data;
    const [existingType] = await db.select().from(subscriptionTypes).where(eq(subscriptionTypes.id, id));
    if (!existingType) {
      return json({ message: "Subscription type not found" }, { status: 404 });
    }
    if (name !== existingType.name) {
      const [nameExists] = await db.select().from(subscriptionTypes).where(eq(subscriptionTypes.name, name));
      if (nameExists) {
        return json(
          { message: "Subscription type with this name already exists" },
          { status: 400 }
        );
      }
    }
    const [updatedType] = await db.update(subscriptionTypes).set({
      name,
      duration,
      amount
    }).where(eq(subscriptionTypes.id, id)).returning();
    return json({ subscriptionType: updatedType });
  } catch (err) {
    console.error("Error updating subscription type:", err);
    return json({ message: "Failed to update subscription type" }, { status: 500 });
  }
};
const DELETE = async ({ locals, params }) => {
  try {
    if (!locals.user || locals.user.type !== "admin") {
      return json(
        { authenticated: false, message: "User is not an admin." },
        { status: 403 }
      );
    }
    const { id } = params;
    if (!id) {
      return json({ message: "Subscription type ID is required" }, { status: 400 });
    }
    const [existingType] = await db.select().from(subscriptionTypes).where(eq(subscriptionTypes.id, id));
    if (!existingType) {
      return json({ message: "Subscription type not found" }, { status: 404 });
    }
    await db.update(subscriptionTypes).set({ isActive: false }).where(eq(subscriptionTypes.id, id));
    return json({ success: true });
  } catch (err) {
    console.error("Error deleting subscription type:", err);
    return json({ message: "Failed to delete subscription type" }, { status: 500 });
  }
};
export {
  DELETE,
  PUT
};
