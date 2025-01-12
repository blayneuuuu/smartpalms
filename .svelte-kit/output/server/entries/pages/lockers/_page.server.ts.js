import { d as db, l as lockers } from "../../../chunks/index2.js";
const load = async () => {
  try {
    const allLockers = await db.select().from(lockers);
    const formattedLockers = allLockers.map((locker) => ({
      ...locker,
      isAvailable: !locker.userId || locker.userId === ""
    }));
    return {
      lockers: formattedLockers
    };
  } catch (error) {
    console.error("Error loading lockers:", error);
    return {
      lockers: [],
      error: "Failed to load lockers"
    };
  }
};
export {
  load
};
