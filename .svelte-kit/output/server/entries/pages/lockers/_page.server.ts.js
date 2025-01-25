import { e as error } from "../../../chunks/index.js";
import { d as db, l as lockers, a as lockerRequests, s as subscriptionTypes } from "../../../chunks/index2.js";
import { asc, eq } from "drizzle-orm";
const load = async ({ locals }) => {
  try {
    console.log("Loading data from database...");
    const allLockers = await db.select().from(lockers).orderBy(lockers.size, asc(lockers.number));
    const pendingRequests = await db.select().from(lockerRequests).where(eq(lockerRequests.status, "pending"));
    const activeSubscriptionTypes = await db.select().from(subscriptionTypes).where(eq(subscriptionTypes.isActive, true));
    const lockersToPendingRequests = new Map(
      pendingRequests.map((request) => [request.lockerId, request])
    );
    const lockersWithAvailability = allLockers.map((locker) => {
      const hasPendingRequest = lockersToPendingRequests.has(locker.id);
      return {
        ...locker,
        isAvailable: !locker.userId && !hasPendingRequest,
        hasPendingRequest
      };
    });
    const sizeOrder = {
      small: 1,
      medium: 2,
      large: 3
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
      subscriptionTypes: activeSubscriptionTypes
    };
  } catch (err) {
    console.error("Error loading data:", err);
    throw error(
      500,
      err instanceof Error ? err.message : "Failed to load data"
    );
  }
};
export {
  load
};
