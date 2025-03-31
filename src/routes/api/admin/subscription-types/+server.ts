import {json} from "@sveltejs/kit";
import type {RequestHandler} from "./$types";
import {db} from "$lib/server/db";
import {subscriptionTypes} from "$lib/server/db/schema";
import {eq} from "drizzle-orm";
import {z} from "zod";

const subscriptionTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  duration: z.enum(["1_day", "7_days", "30_days"], {
    required_error: "Duration is required",
    invalid_type_error: "Invalid duration",
  }),
  size: z.enum(["small", "medium", "large"], {
    required_error: "Size is required",
    invalid_type_error: "Invalid size",
  }),
  amount: z.number().min(0, "Amount must be greater than or equal to 0"),
});

export const GET: RequestHandler = async ({locals}) => {
  try {
    console.log(
      "GET /api/admin/subscription-types - Auth:",
      locals.user ? `${locals.user.name} (${locals.user.type})` : "No user"
    );

    // TEMPORARY: Bypass auth for debugging
    // if (!locals.user || locals.user.type !== "admin") {
    //   return json(
    //     {authenticated: false, message: "User is not an admin."},
    //     {status: 403}
    //   );
    // }

    console.log("Fetching subscription types from the database");
    const types = await db.select().from(subscriptionTypes);

    console.log(`Found ${types.length} subscription types:`, types);

    // Return with cache headers to reduce load
    return json(
      {subscriptionTypes: types},
      {
        headers: {
          "Cache-Control": "public, max-age=300", // Cache for 5 minutes
          Expires: new Date(Date.now() + 300000).toUTCString(),
        },
      }
    );
  } catch (err) {
    console.error("Error fetching subscription types:", err);
    return json({message: "Failed to fetch subscription types"}, {status: 500});
  }
};

export const POST: RequestHandler = async ({request, locals}) => {
  try {
    if (!locals.user || locals.user.type !== "admin") {
      return json(
        {authenticated: false, message: "User is not an admin."},
        {status: 403}
      );
    }

    const body = await request.json();
    const result = subscriptionTypeSchema.safeParse(body);

    if (!result.success) {
      const {errors} = result.error;
      return json({message: errors[0].message}, {status: 400});
    }

    const {name, duration, size, amount} = result.data;

    // Check if subscription type with same name exists
    const [existingType] = await db
      .select()
      .from(subscriptionTypes)
      .where(eq(subscriptionTypes.name, name));

    if (existingType) {
      return json(
        {message: "Subscription type with this name already exists"},
        {status: 400}
      );
    }

    // Create new subscription type
    const [newType] = await db
      .insert(subscriptionTypes)
      .values({
        id: crypto.randomUUID(),
        name,
        duration,
        size,
        amount,
        isActive: true,
      })
      .returning();

    return json({subscriptionType: newType});
  } catch (err) {
    console.error("Error creating subscription type:", err);
    return json({message: "Failed to create subscription type"}, {status: 500});
  }
};
