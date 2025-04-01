import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { lockers } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

// Define the type for our locker status details
type LockerStatusDetail = {
  id: string;
  number: string;
  wasOccupied: boolean;
  nowOccupied: boolean;
  hasUser: boolean;
};

export const GET: RequestHandler = async ({ locals }) => {
  try {
    if (!locals.user || locals.user.type !== "admin") {
      return json(
        { authenticated: false, message: "User is not an admin." },
        { status: 403 },
      );
    }

    // Get all lockers
    const allLockers = await db.select().from(lockers);

    console.log("Found", allLockers.length, "lockers to check");

    // Track results
    const results = {
      totalChecked: allLockers.length,
      updated: 0,
      alreadyCorrect: 0,
      details: [] as LockerStatusDetail[],
    };

    // Process each locker
    for (const locker of allLockers) {
      const shouldBeOccupied = locker.userId != null;

      // Log the current state
      console.log(
        `Locker ${locker.number}: userId=${locker.userId}, isOccupied=${locker.isOccupied}, shouldBeOccupied=${shouldBeOccupied}`,
      );

      // If the occupation status is incorrect, update it
      if (locker.isOccupied !== shouldBeOccupied) {
        console.log(
          `Fixing locker ${locker.number} - setting isOccupied to ${shouldBeOccupied}`,
        );

        // Update the locker
        await db
          .update(lockers)
          .set({
            isOccupied: shouldBeOccupied,
          })
          .where(eq(lockers.id, locker.id));

        results.updated++;
        results.details.push({
          id: locker.id,
          number: locker.number,
          wasOccupied: locker.isOccupied,
          nowOccupied: shouldBeOccupied,
          hasUser: !!locker.userId,
        });
      } else {
        results.alreadyCorrect++;
      }
    }

    return json({
      success: true,
      message: `Fixed ${results.updated} lockers, ${results.alreadyCorrect} were already correct`,
      results,
    });
  } catch (error) {
    console.error("Error fixing locker occupation status:", error);
    if (error instanceof Error) {
      return json({ message: error.message, success: false }, { status: 500 });
    }
    return json(
      { message: "Failed to fix locker occupation status", success: false },
      { status: 500 },
    );
  }
};
