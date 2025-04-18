import {json} from "@sveltejs/kit";
import type {RequestHandler} from "./$types";
import {db} from "$lib/server/db";
import {subscriptions, lockers} from "$lib/server/db/schema";
import {eq, and} from "drizzle-orm";
import {directClient} from "$lib/db/direct-client";

// This endpoint is only for development/test purposes
export const GET: RequestHandler = async ({url}) => {
  if (process.env.NODE_ENV === "production") {
    return json({error: "Not available in production"}, {status: 403});
  }

  const lockerId = url.searchParams.get("lockerId");

  if (!lockerId) {
    return json({error: "Missing lockerId parameter"}, {status: 400});
  }

  try {
    console.log(`Checking subscriptions for locker: ${lockerId}`);

    // Check active subscriptions using Drizzle ORM
    const activeSubscriptions = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.lockerId, lockerId),
          eq(subscriptions.status, "active")
        )
      );

    // Double-check using direct SQL
    const directResult = await directClient.execute({
      sql: `
        SELECT * FROM subscriptions 
        WHERE locker_id = ? AND status = 'active'
      `,
      args: [lockerId],
    });

    // Check locker status
    const [locker] = await db
      .select()
      .from(lockers)
      .where(eq(lockers.id, lockerId));

    return json({
      lockerId,
      lockerDetails: locker || "Locker not found",
      activeSubscriptionsCount: activeSubscriptions.length,
      activeSubscriptions,
      directResultCount: directResult.rows.length,
      directResult: directResult.rows,
    });
  } catch (error) {
    console.error("Error checking subscriptions:", error);
    return json({error: "Failed to check subscriptions"}, {status: 500});
  }
};
