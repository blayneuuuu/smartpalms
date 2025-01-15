// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
// routes/lockers/+page.server.ts
import type {PageServerLoad} from "./$types";
import {error} from "@sveltejs/kit";
import {db} from "$lib/server/db";
import {
  lockers,
  subscriptionTypes,
  lockerRequests,
} from "$lib/server/db/schema";
import {eq, and, sql} from "drizzle-orm";

export const load = async ({locals}: Parameters<PageServerLoad>[0]) => {
  try {
    console.log("Loading data from database...");

    // Get all lockers
    const allLockers = await db.select().from(lockers);

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

    console.log("Fetched lockers:", lockersWithAvailability);
    console.log("Fetched subscription types:", activeSubscriptionTypes);

    return {
      lockers: lockersWithAvailability,
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
