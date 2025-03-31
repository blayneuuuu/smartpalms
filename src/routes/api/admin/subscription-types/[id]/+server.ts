import {json} from "@sveltejs/kit";
import type {RequestHandler} from "./$types";
import {db} from "$lib/server/db";
import {subscriptionTypes} from "$lib/server/db/schema";
import {eq, and} from "drizzle-orm";
import {z} from "zod";
import {lockerRequests} from "$lib/server/db/schema";

const subscriptionTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  duration: z.enum(["1_day", "3_days", "7_days", "30_days"], {
    required_error: "Duration is required",
    invalid_type_error: "Invalid duration",
  }),
  size: z.enum(["small", "medium", "large"], {
    required_error: "Size is required",
    invalid_type_error: "Invalid size",
  }),
  amount: z.number().min(0, "Amount must be greater than or equal to 0"),
  isActive: z.boolean().optional(),
});

export const PUT: RequestHandler = async ({request, locals, params}) => {
  try {
    if (!locals.user || locals.user.type !== "admin") {
      return json(
        {authenticated: false, message: "User is not an admin."},
        {status: 403}
      );
    }

    const {id} = params;
    if (!id) {
      return json({message: "Subscription type ID is required"}, {status: 400});
    }

    const body = await request.json();
    const result = subscriptionTypeSchema.safeParse(body);

    if (!result.success) {
      const {errors} = result.error;
      return json({message: errors[0].message}, {status: 400});
    }

    const {name, duration, size, amount} = result.data;

    // Check if subscription type exists
    const [existingType] = await db
      .select()
      .from(subscriptionTypes)
      .where(eq(subscriptionTypes.id, id));

    if (!existingType) {
      return json({message: "Subscription type not found"}, {status: 404});
    }

    // Handle isActive status (use the provided value or keep the existing one)
    const isActive =
      result.data.isActive !== undefined
        ? result.data.isActive
        : existingType.isActive;

    // Check if name is taken by another subscription type
    if (name !== existingType.name) {
      const [nameExists] = await db
        .select()
        .from(subscriptionTypes)
        .where(eq(subscriptionTypes.name, name));

      if (nameExists) {
        return json(
          {message: "Subscription type with this name already exists"},
          {status: 400}
        );
      }
    }

    // Update subscription type
    const [updatedType] = await db
      .update(subscriptionTypes)
      .set({
        name,
        duration,
        size,
        amount,
        isActive,
      })
      .where(eq(subscriptionTypes.id, id))
      .returning();

    return json({subscriptionType: updatedType});
  } catch (err) {
    console.error("Error updating subscription type:", err);
    return json({message: "Failed to update subscription type"}, {status: 500});
  }
};

export const DELETE: RequestHandler = async ({locals, params}) => {
  try {
    if (!locals.user || locals.user.type !== "admin") {
      return json(
        {authenticated: false, message: "User is not an admin."},
        {status: 403}
      );
    }

    const {id} = params;
    if (!id) {
      return json({message: "Subscription type ID is required"}, {status: 400});
    }

    // Check if subscription type exists
    const [existingType] = await db
      .select()
      .from(subscriptionTypes)
      .where(eq(subscriptionTypes.id, id));

    if (!existingType) {
      return json({message: "Subscription type not found"}, {status: 404});
    }

    // Check if there are any pending requests using this subscription type
    const pendingRequests = await db
      .select()
      .from(lockerRequests)
      .where(
        and(
          eq(lockerRequests.subscriptionTypeId, id),
          eq(lockerRequests.status, "pending")
        )
      );

    if (pendingRequests.length > 0) {
      return json(
        {
          message: "Cannot delete subscription type with pending requests",
          pending: pendingRequests.length,
        },
        {status: 400}
      );
    }

    // First delete any related locker requests
    const deletedRequests = await db
      .delete(lockerRequests)
      .where(eq(lockerRequests.subscriptionTypeId, id))
      .returning();

    console.log(`Deleted ${deletedRequests.length} related locker requests`);

    // Now delete the subscription type
    const deletedTypes = await db
      .delete(subscriptionTypes)
      .where(eq(subscriptionTypes.id, id))
      .returning();

    console.log(`Deleted subscription type:`, deletedTypes[0]);

    return json({
      success: true,
      message: "Subscription type deleted successfully",
      id,
    });
  } catch (err) {
    console.error("Error deleting subscription type:", err);
    return json(
      {
        message: "Failed to delete subscription type",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      {status: 500}
    );
  }
};
