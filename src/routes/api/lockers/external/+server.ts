import {redirect} from "@sveltejs/kit";
import type {RequestHandler} from "./$types";

/**
 * @deprecated Use /api/access/authenticated instead
 * This endpoint is kept for backward compatibility and redirects to the new authenticated access endpoint.
 */

export const POST: RequestHandler = async () => {
  return redirect(308, "/api/access/authenticated");
};
