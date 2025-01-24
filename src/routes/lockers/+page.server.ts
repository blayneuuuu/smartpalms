/* eslint-disable @typescript-eslint/no-unused-vars */
// routes/lockers/+page.server.ts
import type {PageServerLoad} from "./$types";
import {error} from "@sveltejs/kit";
import {db} from "$lib/server/db";
import {
  lockers,
  subscriptionTypes,
  lockerRequests,
  type LockerSize,
} from "$lib/server/db/schema";
import {eq, and, sql, asc} from "drizzle-orm";

export const load: PageServerLoad = async ({locals}) => {
  try {
    console.log("Loading data from database...");

    // Get all lockers, sorted by size and number
    const allLockers = await db
      .select()
      .from(lockers)
      .orderBy(lockers.size, asc(lockers.number));

    // Get all pending requests
    const pendingRequests = await db
      .select()
      .from(lockerRequests)
      .where(eq(lockerRequests.status, "pending"));

    // Get active subscription types
    const activeSubscriptionTypes = await db
      .select()
      .from(subscriptionTypes)
      .where(eq(subscriptionTypes.isActive, true));

    // Map pending requests to locker IDs for easy lookup
    const lockersToPendingRequests = new Map(
      pendingRequests.map((request) => [request.lockerId, request])
    );

    // Add availability and pending request status to each locker
    const lockersWithAvailability = allLockers.map((locker) => {
      const hasPendingRequest = lockersToPendingRequests.has(locker.id);
      return {
        ...locker,
        isAvailable: !locker.userId && !hasPendingRequest,
        hasPendingRequest,
      };
    });

    // Sort lockers by custom size order (small, medium, large)
    const sizeOrder: Record<LockerSize, number> = {
      small: 1,
      medium: 2,
      large: 3,
    };
    const sortedLockers = lockersWithAvailability.sort((a, b) => {
      const sizeCompare = sizeOrder[a.size] - sizeOrder[b.size];
      if (sizeCompare !== 0) return sizeCompare;
      return a.number.localeCompare(b.number);
    });

    console.log("Fetched lockers:", sortedLockers);
    console.log("Fetched subscription types:", activeSubscriptionTypes);

    return {
      lockers: sortedLockers,
      subscriptionTypes: activeSubscriptionTypes,
    };
  } catch (err) {
    console.error("Error loading data:", err);
    throw error(
      500,
      err instanceof Error ? err.message : "Failed to load data"
    );
  }
};
