import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import type { ExternalAccessResponse } from "$lib/types/api";
import { APIErrors, handleError } from "$lib/server/errors";
import { validateRequest } from "$lib/server/middleware";
import { z } from "zod";
import { LockerService } from "$lib/services/core";

/**
 * Direct Access Endpoint
 *
 * This endpoint is designed for hardware devices to directly access lockers
 * without user authentication. It's typically used by embedded systems
 * or control panels that need direct locker access.
 *
 * No user authentication is required, but the request must include a valid locker_id.
 * All access attempts are logged to the access history for auditing purposes.
 *
 * Security Note: This endpoint should be protected by IP restrictions
 * or other network-level security measures in production.
 */

const accessSchema = z.object({
  locker_id: z.string().min(1, "Locker ID is required"),
});

export const POST: RequestHandler = async (event) => {
  try {
    const { locker_id } = await validateRequest(event, accessSchema);

    // Use the LockerService to handle direct access
    const result = await LockerService.directAccess(locker_id);

    if (!result.success) {
      throw APIErrors.LOCKER.NOT_FOUND();
    }

    const response: ExternalAccessResponse = {
      success: true,
      locker: {
        id: result.locker!.id,
        number: result.locker!.number,
      },
    };

    return json(response);
  } catch (err) {
    return handleError(err);
  }
};
