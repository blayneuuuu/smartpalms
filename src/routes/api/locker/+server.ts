/* eslint-disable @typescript-eslint/no-unused-vars */
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/server/db";
import { lockers } from "$lib/server/db/schema";

export const GET: RequestHandler = async ({ locals }) => {
  try {
    // Get all lockers
    const allLockers = await db.select().from(lockers);

    // Transform the data if needed (e.g., formatting, calculating availability)
    const formattedLockers = allLockers.map((locker) => ({
      ...locker,
      isAvailable: !locker.userId || locker.userId === "",
    }));

    return json(
      {
        success: true,
        data: formattedLockers,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error fetching lockers:", error);

    return json(
      {
        success: false,
        message: "Failed to fetch lockers",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      },
    );
  }
};
