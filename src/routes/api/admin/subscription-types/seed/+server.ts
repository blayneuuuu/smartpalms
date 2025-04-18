import {json} from "@sveltejs/kit";
import type {RequestHandler} from "@sveltejs/kit";
import {db} from "$lib/server/db";
import {subscriptionTypes} from "$lib/server/db/schema";
import type {NewSubscriptionType} from "$lib/server/db/schema";
import crypto from "crypto";

// Default subscription types to seed
const DEFAULT_SUBSCRIPTION_TYPES: NewSubscriptionType[] = [
  {
    id: crypto.randomUUID(),
    name: "1 Day Pass (Small)",
    duration: "1_day",
    size: "small",
    amount: 2000, // 20 PHP
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: "1 Week Pass (Small)",
    duration: "7_days",
    size: "small",
    amount: 10000, // 100 PHP
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: "1 Month Pass (Small)",
    duration: "30_days",
    size: "small",
    amount: 35000, // 350 PHP
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: "1 Day Pass (Large)",
    duration: "1_day",
    size: "large",
    amount: 3000, // 30 PHP
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: "1 Week Pass (Large)",
    duration: "7_days",
    size: "large",
    amount: 15000, // 150 PHP
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: "1 Month Pass (Large)",
    duration: "30_days",
    size: "large",
    amount: 50000, // 500 PHP
    isActive: true,
  },
];

/**
 * Admin endpoint to check and seed subscription types if needed
 */
export const GET: RequestHandler = async ({locals}) => {
  // Check if user is admin
  if (!locals.user || locals.user.type !== "admin") {
    return json({success: false, message: "Unauthorized"}, {status: 403});
  }

  try {
    // Check if there are any subscription types
    const existingTypes = await db.select().from(subscriptionTypes);

    console.log(`[ADMIN] Found ${existingTypes.length} subscription types`);

    // If there are already subscription types, just return them
    if (existingTypes.length > 0) {
      return json({
        success: true,
        message: "Subscription types already exist",
        count: existingTypes.length,
        types: existingTypes,
        seeded: false,
      });
    }

    // If no subscription types exist, seed the default ones
    console.log(`[ADMIN] No subscription types found, seeding defaults...`);

    // Insert the default types
    const insertedTypes = await db
      .insert(subscriptionTypes)
      .values(DEFAULT_SUBSCRIPTION_TYPES)
      .returning();

    console.log(
      `[ADMIN] Successfully seeded ${insertedTypes.length} subscription types`
    );

    return json({
      success: true,
      message: `Successfully seeded ${insertedTypes.length} subscription types`,
      types: insertedTypes,
      seeded: true,
      count: insertedTypes.length,
    });
  } catch (error) {
    console.error("[ADMIN] Error checking/seeding subscription types:", error);
    return json(
      {
        success: false,
        message: "An error occurred while seeding subscription types",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {status: 500}
    );
  }
};
