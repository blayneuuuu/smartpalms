import {json} from "@sveltejs/kit";
import {error} from "@sveltejs/kit";
import type {AuthenticatedRequestHandler} from "../../types";
import {db} from "$lib/server/db";
import {lockerRequests, lockers, admins} from "$lib/server/db/schema";
import {eq, and} from "drizzle-orm";

export const GET: AuthenticatedRequestHandler = async ({locals}) => {
  const {userId} = locals.auth;
  if (!userId) {
    throw error(401, "Unauthorized");
  }

  // Verify admin status
  const admin = await db.query.admins.findFirst({
    where: eq(admins.userId, userId),
  });

  if (!admin) {
    throw error(403, "Forbidden - Admin access required");
  }

  try {
    // First get all pending requests
    const requests = await db
      .select({
        id: lockerRequests.id,
        userId: lockerRequests.userId,
        lockerId: lockerRequests.lockerId,
        status: lockerRequests.status,
        requestedAt: lockerRequests.requestedAt,
        proofOfPayment: lockerRequests.proofOfPayment,
      })
      .from(lockerRequests)
      .where(eq(lockerRequests.status, "pending"))
      .orderBy(lockerRequests.requestedAt);

    // Then get the locker numbers for these requests
    const lockerDetails = await db
      .select({
        id: lockers.id,
        number: lockers.number,
      })
      .from(lockers)
      .where(and(...requests.map((req) => eq(lockers.id, req.lockerId))));

    // Create a map of locker IDs to numbers
    const lockerMap = new Map(
      lockerDetails.map((locker) => [locker.id, locker.number])
    );

    // Format the response
    const formattedRequests = requests.map((request) => ({
      id: request.id,
      userId: request.userId,
      lockerId: request.lockerId,
      lockerNumber: lockerMap.get(request.lockerId) ?? "Unknown",
      requestedAt: request.requestedAt,
      status: request.status,
      proofOfPayment: request.proofOfPayment,
    }));

    return json({requests: formattedRequests});
  } catch (err) {
    console.error("Error fetching requests:", err);
    if (err instanceof Error) {
      throw error(500, err.message);
    }
    throw error(500, "Failed to fetch requests");
  }
};
