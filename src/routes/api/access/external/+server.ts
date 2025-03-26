import {redirect} from "@sveltejs/kit";
import type {RequestHandler} from "@sveltejs/kit";

/**
 * @deprecated Use /api/access/direct instead
 * This endpoint is kept for backward compatibility and redirects to the new direct access endpoint.
 */

export const POST: RequestHandler = async () => {
  return redirect(308, "/api/access/direct");
};
