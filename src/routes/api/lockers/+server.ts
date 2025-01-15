import {json} from "@sveltejs/kit";
import {error} from "@sveltejs/kit";
import type {RequestHandler} from "./$types";
import {db} from "$lib/server/db";
import {lockers} from "$lib/server/db/schema";

// Get all lockers
export const GET: RequestHandler = async () => {
  console.log("GET /api/lockers called");

  // Verify database connection
  if (!db) {
    console.error("Database connection not initialized");
    throw error(500, "Database connection error");
  }

  try {
    console.log("Executing database query...");
    const allLockers = await db.select().from(lockers);
    console.log("Raw lockers data:", allLockers);

    if (!Array.isArray(allLockers)) {
      console.error("Unexpected response format:", allLockers);
      throw error(500, "Invalid data format from database");
    }

    const formattedLockers = allLockers.map((locker) => ({
      ...locker,
      isAvailable: !locker.userId || locker.userId === "",
    }));

    console.log("Sending response with formatted lockers:", formattedLockers);
    return json({
      success: true,
      lockers: formattedLockers,
    });
  } catch (err) {
    console.error("Error in /api/lockers:", err);
    throw error(
      500,
      err instanceof Error ? err.message : "Failed to fetch lockers"
    );
  }
};
