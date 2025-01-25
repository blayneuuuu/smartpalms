import { e as error, j as json } from "../../../../../../../chunks/index.js";
import { d as db, c as accessHistory, l as lockers } from "../../../../../../../chunks/index2.js";
import { eq } from "drizzle-orm";
const GET = async ({ params, locals }) => {
  if (!locals.user) {
    throw error(401, "Unauthorized");
  }
  const userId = params.id;
  if (!userId) {
    throw error(400, "User ID is required");
  }
  if (userId !== locals.user.id) {
    throw error(403, "You can only access your own history");
  }
  try {
    const history = await db.select({
      id: accessHistory.id,
      lockerId: accessHistory.lockerId,
      lockerNumber: lockers.number,
      accessType: accessHistory.accessType,
      otp: accessHistory.otp,
      status: accessHistory.status,
      accessedAt: accessHistory.accessedAt
    }).from(accessHistory).leftJoin(lockers, eq(accessHistory.lockerId, lockers.id)).where(eq(lockers.userId, userId)).orderBy(accessHistory.accessedAt);
    return json({
      success: true,
      history
    });
  } catch (err) {
    console.error("Error fetching access history:", err);
    throw error(500, "Failed to fetch access history");
  }
};
export {
  GET
};
