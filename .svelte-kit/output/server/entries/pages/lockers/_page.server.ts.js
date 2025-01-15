import { e as error } from "../../../chunks/index.js";
import { d as db, b as lockers, l as lockerRequests, c as subscriptionTypes } from "../../../chunks/index2.js";
import { eq } from "drizzle-orm";
const load = async ({ locals }) => {
  try {
    console.log("Loading data from database...");
    const allLockers = await db.select().from(lockers);
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
    console.log("Fetched lockers:", lockersWithAvailability);
    console.log("Fetched subscription types:", activeSubscriptionTypes);
    return {
      lockers: lockersWithAvailability,
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
