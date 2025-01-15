import {json} from "@sveltejs/kit";
import {error} from "@sveltejs/kit";
import type {RequestHandler} from "./$types";
import {db} from "$lib/server/db";
import {subscriptionTypes} from "$lib/server/db/schema";
import {eq, sql} from "drizzle-orm";

export const GET: RequestHandler = async () => {
  try {
    const types = await db
      .select()
      .from(subscriptionTypes)
      .where(eq(subscriptionTypes.isActive, sql`1`));

    return json({subscriptionTypes: types});
  } catch (err) {
    console.error("Error fetching subscription types:", err);
    throw error(500, "Failed to fetch subscription types");
  }
};
