import { json } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/server/db";
import { lockers } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

// Get single locker
export const GET: RequestHandler = async ({ params }) => {
  try {
    const locker = await db
      .select()
      .from(lockers)
      .where(eq(lockers.id, params.id))
      .get();

    if (!locker) {
      throw error(404, "Locker not found");
    }

    return json({
      locker: {
        ...locker,
        isAvailable: !locker.userId || locker.userId === "",
      },
    });
  } catch (err) {
    console.error("Error fetching locker:", err);
    throw error(500, "Failed to fetch locker");
  }
};
