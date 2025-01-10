/* eslint-disable @typescript-eslint/no-unused-vars */
// routes/lockers/+page.server.ts
import {db} from "$lib/server/db";
import {lockers} from "$lib/server/db/schema";
import type {PageServerLoad} from "./$types";
import type {Locker} from "$lib/server/db/schema";

export const load: PageServerLoad = async () => {
  try {
    const allLockers = await db.select().from(lockers);

    const formattedLockers = allLockers.map((locker) => ({
      ...locker,
      isAvailable: !locker.userId || locker.userId === "",
    }));

    return {
      lockers: formattedLockers,
    };
  } catch (error) {
    console.error("Error loading lockers:", error);
    return {
      lockers: [],
      error: "Failed to load lockers",
    };
  }
};
