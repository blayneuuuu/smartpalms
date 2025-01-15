import { e as error, j as json } from "../../../../../chunks/index.js";
import { d as db, a as admins, l as lockerRequests, b as lockers } from "../../../../../chunks/index2.js";
import { eq, and } from "drizzle-orm";
const GET = async ({ locals }) => {
  const { userId } = locals.auth;
  if (!userId) {
    throw error(401, "Unauthorized");
  }
  const admin = await db.query.admins.findFirst({
    where: eq(admins.userId, userId)
  });
  if (!admin) {
    throw error(403, "Forbidden - Admin access required");
  }
  try {
    const requests = await db.select({
      id: lockerRequests.id,
      userId: lockerRequests.userId,
      lockerId: lockerRequests.lockerId,
      status: lockerRequests.status,
      requestedAt: lockerRequests.requestedAt,
      proofOfPayment: lockerRequests.proofOfPayment
    }).from(lockerRequests).where(eq(lockerRequests.status, "pending")).orderBy(lockerRequests.requestedAt);
    const lockerDetails = await db.select({
      id: lockers.id,
      number: lockers.number
    }).from(lockers).where(and(...requests.map((req) => eq(lockers.id, req.lockerId))));
    const lockerMap = new Map(
      lockerDetails.map((locker) => [locker.id, locker.number])
    );
    const formattedRequests = requests.map((request) => ({
      id: request.id,
      userId: request.userId,
      lockerId: request.lockerId,
      lockerNumber: lockerMap.get(request.lockerId) ?? "Unknown",
      requestedAt: request.requestedAt,
      status: request.status,
      proofOfPayment: request.proofOfPayment
    }));
    return json({ requests: formattedRequests });
  } catch (err) {
    console.error("Error fetching requests:", err);
    if (err instanceof Error) {
      throw error(500, err.message);
    }
    throw error(500, "Failed to fetch requests");
  }
};
export {
  GET
};
