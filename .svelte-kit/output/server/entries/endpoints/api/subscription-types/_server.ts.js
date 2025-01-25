import { j as json, e as error } from "../../../../chunks/index.js";
import { d as db, s as subscriptionTypes } from "../../../../chunks/index2.js";
import { eq, sql } from "drizzle-orm";
const GET = async () => {
  try {
    const types = await db.select().from(subscriptionTypes).where(eq(subscriptionTypes.isActive, sql`1`));
    return json({ subscriptionTypes: types });
  } catch (err) {
    console.error("Error fetching subscription types:", err);
    throw error(500, "Failed to fetch subscription types");
  }
};
export {
  GET
};
