import {json} from "@sveltejs/kit";
import {error} from "@sveltejs/kit";
import type {RequestHandler} from "./$types";
import {db} from "$lib/server/db";
import {lockerRequests} from "$lib/server/db/schema";
import {eq} from "drizzle-orm";

export const POST: RequestHandler = async ({params, request, locals}) => {
  const userId = locals.auth?.userId;
  if (!userId) {
    throw error(401, "Unauthorized");
  }

  const requestId = params.id;
  if (!requestId) {
    throw error(400, "Request ID is required");
  }

  try {
    // Get the request and verify ownership
    const lockerRequest = await db
      .select()
      .from(lockerRequests)
      .where(eq(lockerRequests.id, requestId))
      .get();

    if (!lockerRequest) {
      throw error(404, "Request not found");
    }

    if (lockerRequest.userId !== userId) {
      throw error(403, "You don't have access to this request");
    }

    if (lockerRequest.status !== "rejected") {
      throw error(400, "Only rejected requests can be resubmitted");
    }

    const {proofOfPayment} = await request.json();

    // Update the request
    await db
      .update(lockerRequests)
      .set({
        status: "pending",
        rejectionReason: null,
        processedAt: null,
        processedBy: null,
        ...(proofOfPayment ? {proofOfPayment} : {}),
      })
      .where(eq(lockerRequests.id, requestId));

    return json({success: true});
  } catch (err) {
    console.error("Error resubmitting request:", err);
    throw error(500, "Failed to resubmit request");
  }
};
