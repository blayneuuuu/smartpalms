import {json} from "@sveltejs/kit";
import {db} from "$lib/server/db";
import {lockers, accessHistory} from "$lib/server/db/schema";
import {eq} from "drizzle-orm";
import type {RequestHandler} from "@sveltejs/kit";
import type {ExternalAccessResponse} from "$lib/types/api";
import {APIErrors, handleError} from "$lib/server/errors";
import {validateRequest} from "$lib/server/middleware";
import {z} from "zod";

const accessSchema = z.object({
  locker_id: z.string().min(1, "Locker ID is required"),
});

export const POST: RequestHandler = async (event) => {
  try {
    const {locker_id} = await validateRequest(event, accessSchema);

    // Get locker details
    const [locker] = await db
      .select()
      .from(lockers)
      .where(eq(lockers.id, locker_id));

    if (!locker) {
      // Create failed access history
      await db.insert(accessHistory).values({
        id: crypto.randomUUID(),
        lockerId: locker_id,
        accessType: "external",
        status: "failed",
      });

      throw APIErrors.LOCKER.NOT_FOUND();
    }

    // Create successful access history
    await db.insert(accessHistory).values({
      id: crypto.randomUUID(),
      lockerId: locker_id,
      accessType: "external",
      status: "success",
    });

    // Update last accessed time
    await db
      .update(lockers)
      .set({
        lastAccessedAt: new Date(),
      })
      .where(eq(lockers.id, locker_id));

    const response: ExternalAccessResponse = {
      success: true,
      locker: {
        id: locker.id,
        number: locker.number,
      },
    };
    return json(response);
  } catch (err) {
    return handleError(err);
  }
};
