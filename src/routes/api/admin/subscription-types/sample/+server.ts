import {json} from "@sveltejs/kit";
import type {RequestHandler} from "./$types";
import {db} from "$lib/server/db";
import {subscriptionTypes} from "$lib/server/db/schema";
import {eq} from "drizzle-orm";
import {randomUUID} from "crypto";

// GET endpoint to create a sample subscription type
export const GET: RequestHandler = async () => {
  try {
    console.log("Creating sample subscription type");

    // Check if a sample already exists
    const [existingSample] = await db
      .select()
      .from(subscriptionTypes)
      .where(eq(subscriptionTypes.name, "Sample Plan"));

    if (existingSample) {
      console.log("Sample already exists:", existingSample);
      return json({
        message: "Sample already exists",
        subscriptionType: existingSample,
      });
    }

    // Create a new sample subscription type
    const [newType] = await db
      .insert(subscriptionTypes)
      .values({
        id: randomUUID(),
        name: "Sample Plan",
        duration: "1_day",
        amount: 10000, // ₱100
        isActive: true,
      })
      .returning();

    console.log("Created sample subscription type:", newType);

    return json({
      message: "Sample created successfully",
      subscriptionType: newType,
    });
  } catch (err) {
    console.error("Error creating sample subscription type:", err);
    return json({message: "Failed to create sample"}, {status: 500});
  }
};
