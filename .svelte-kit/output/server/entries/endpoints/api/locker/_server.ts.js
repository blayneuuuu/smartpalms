import { j as json } from "../../../../chunks/index.js";
import { d as db, l as lockers } from "../../../../chunks/index2.js";
const GET = async ({ locals }) => {
  try {
    const allLockers = await db.select().from(lockers);
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
export { GET };
