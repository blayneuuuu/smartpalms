import { e as error, j as json } from "../../../../../chunks/index.js";
import { d as db, b as lockers } from "../../../../../chunks/index2.js";
import { eq } from "drizzle-orm";
const GET = async ({ params }) => {
  try {
    const locker = await db.select().from(lockers).where(eq(lockers.id, params.id)).get();
    if (!locker) {
      throw error(404, "Locker not found");
    }
    return json({
      locker: {
        ...locker,
        isAvailable: !locker.userId || locker.userId === ""
      }
    });
  } catch (err) {
    console.error("Error fetching locker:", err);
    throw error(500, "Failed to fetch locker");
  }
};
export {
  GET
};
