import {json} from "@sveltejs/kit";
import type {RequestHandler} from "./$types";
import {db} from "$lib/server/db";
import {
  lockers,
  users,
  subscriptions,
  subscriptionTypes,
} from "$lib/server/db/schema";
import {eq, and, ne} from "drizzle-orm";
import {z} from "zod";
import {randomUUID} from "crypto";

// PUT handler for updating locker properties
export const PUT: RequestHandler = async ({locals, params, request}) => {
  try {
    console.log("Starting full locker update request");

    if (!locals.user || locals.user.type !== "admin") {
      return json(
        {authenticated: false, message: "User is not an admin."},
        {status: 403}
      );
    }

    const lockerId = params.id;
    if (!lockerId) {
      return json({message: "Locker ID is required"}, {status: 400});
    }

    const body = await request.json();

    // Validate input with Zod
    const lockerUpdateSchema = z.object({
      number: z.string().min(1, "Locker number is required"),
      size: z.enum(["small", "large"], {
        required_error: "Size is required",
        invalid_type_error: "Size must be small or large",
      }),
      userId: z.string().nullable(),
      subscriptionTypeId: z.string().nullable().optional(),
      expiresAt: z.string().nullable().optional(),
    });

    const validationResult = lockerUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return json(
        {
          message: "Invalid locker data",
          errors: validationResult.error.errors,
        },
        {status: 400}
      );
    }

    const {number, size, userId, subscriptionTypeId, expiresAt} =
      validationResult.data;
    console.log("Full locker update request:", {
      lockerId,
      number,
      size,
      userId,
      subscriptionTypeId,
      expiresAt,
    });

    // Check if locker exists
    const [existingLocker] = await db
      .select()
      .from(lockers)
      .where(eq(lockers.id, lockerId));

    if (!existingLocker) {
      console.log("Locker not found:", lockerId);
      return json({message: "Locker not found"}, {status: 404});
    }

    // Check if number is already used by another locker
    if (number !== existingLocker.number) {
      const [duplicateNumber] = await db
        .select()
        .from(lockers)
        .where(and(eq(lockers.number, number), ne(lockers.id, lockerId)));

      if (duplicateNumber) {
        return json(
          {message: `Locker number ${number} is already in use`},
          {status: 400}
        );
      }
    }

    // Handle user assignment
    let isOccupied = existingLocker.isOccupied;
    let updatedLocker;
    let createdSubscription = null;

    // Use a transaction to ensure all operations succeed or fail together
    await db.transaction(async (tx) => {
      if (userId) {
        // Verify the user exists
        const [existingUser] = await tx
          .select()
          .from(users)
          .where(eq(users.id, userId));

        if (!existingUser) {
          throw new Error(`User not found: ${userId}`);
        }

        isOccupied = true;

        // Check for subscription creation
        if (subscriptionTypeId && expiresAt) {
          // Check if the subscription type exists and matches the locker size
          const [subType] = await tx
            .select()
            .from(subscriptionTypes)
            .where(eq(subscriptionTypes.id, subscriptionTypeId));

          if (!subType) {
            throw new Error(
              `Subscription type not found: ${subscriptionTypeId}`
            );
          }

          if (subType.size !== size) {
            throw new Error(
              `Subscription type size (${subType.size}) doesn't match locker size (${size})`
            );
          }

          // Get any existing active subscription for this locker
          const [existingSubscription] = await tx
            .select()
            .from(subscriptions)
            .where(
              and(
                eq(subscriptions.lockerId, lockerId),
                eq(subscriptions.status, "active")
              )
            );

          if (existingSubscription) {
            // Update existing subscription
            await tx
              .update(subscriptions)
              .set({
                userId,
                expiresAt,
                status: "active",
              })
              .where(eq(subscriptions.id, existingSubscription.id));

            console.log(
              `Updated existing subscription: ${existingSubscription.id}`
            );
          } else {
            // Create new subscription
            const subscriptionId = randomUUID();
            await tx.insert(subscriptions).values({
              id: subscriptionId,
              userId,
              lockerId,
              expiresAt,
              status: "active",
            });

            createdSubscription = {
              id: subscriptionId,
              userId,
              lockerId,
              expiresAt,
              status: "active",
            };

            console.log(`Created new subscription: ${subscriptionId}`);
          }
        }
      } else {
        // If removing user, check for active subscriptions
        if (existingLocker.userId) {
          // Find any active subscriptions for this locker
          const activeSubscriptions = await tx
            .select()
            .from(subscriptions)
            .where(
              and(
                eq(subscriptions.lockerId, lockerId),
                eq(subscriptions.status, "active")
              )
            );

          // Update all active subscriptions to cancelled
          for (const sub of activeSubscriptions) {
            await tx
              .update(subscriptions)
              .set({status: "cancelled"})
              .where(eq(subscriptions.id, sub.id));

            console.log(`Cancelled subscription: ${sub.id}`);
          }
        }

        isOccupied = false;
      }

      // Update the locker
      const [updated] = await tx
        .update(lockers)
        .set({
          number,
          size,
          userId,
          isOccupied,
        })
        .where(eq(lockers.id, lockerId))
        .returning();

      updatedLocker = updated;
    });

    console.log("Locker updated successfully:", updatedLocker);

    return json({
      success: true,
      locker: updatedLocker,
      subscription: createdSubscription,
    });
  } catch (error) {
    console.error("Error updating locker:", error);
    if (error instanceof Error) {
      return json({message: error.message}, {status: 500});
    }
    return json({message: "Failed to update locker"}, {status: 500});
  }
};

// PATCH update locker ownership
export const PATCH: RequestHandler = async ({locals, params, request}) => {
  try {
    console.log("Starting locker ownership update request");

    if (!locals.user || locals.user.type !== "admin") {
      return json(
        {authenticated: false, message: "User is not an admin."},
        {status: 403}
      );
    }

    const lockerId = params.id;
    if (!lockerId) {
      return json({message: "Locker ID is required"}, {status: 400});
    }

    const body = await request.json();
    const {userId} = body;

    console.log("Update locker request:", {lockerId, userId});

    // Check if locker exists
    const [existingLocker] = await db
      .select()
      .from(lockers)
      .where(eq(lockers.id, lockerId));

    if (!existingLocker) {
      console.log("Locker not found:", lockerId);
      return json({message: "Locker not found"}, {status: 404});
    }

    console.log("Existing locker:", existingLocker);

    // If userId is null, we're removing ownership
    if (userId === null) {
      console.log("Removing locker ownership");

      // Check if there are active subscriptions
      const [activeSubscription] = await db
        .select()
        .from(subscriptions)
        .where(
          and(
            eq(subscriptions.lockerId, lockerId),
            eq(subscriptions.status, "active")
          )
        );

      if (activeSubscription) {
        console.log(
          "Cannot remove ownership - active subscription exists:",
          activeSubscription
        );
        return json(
          {
            message:
              "Cannot remove ownership: active subscription exists. Delete the subscription first.",
          },
          {status: 400}
        );
      }

      // Update locker to remove ownership
      await db
        .update(lockers)
        .set({
          isOccupied: false,
          userId: null,
        })
        .where(eq(lockers.id, lockerId));

      console.log("Ownership removed successfully");
    } else {
      // Verify the user exists
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));

      if (!existingUser) {
        console.log("User not found:", userId);
        return json({message: "User not found"}, {status: 404});
      }

      console.log("Updating locker ownership to user:", existingUser.name);

      // Update locker with new ownership
      await db
        .update(lockers)
        .set({
          isOccupied: true,
          userId,
        })
        .where(eq(lockers.id, lockerId));

      console.log("Ownership updated successfully");
    }

    // Get the updated locker to verify changes
    const [updatedLocker] = await db
      .select()
      .from(lockers)
      .where(eq(lockers.id, lockerId));

    console.log("Updated locker:", updatedLocker);

    return json({
      success: true,
      locker: updatedLocker,
    });
  } catch (error) {
    console.error("Error updating locker ownership:", error);
    if (error instanceof Error) {
      return json({message: error.message}, {status: 500});
    }
    return json({message: "Failed to update locker ownership"}, {status: 500});
  }
};
