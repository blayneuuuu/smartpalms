import {json} from "@sveltejs/kit";
import type {RequestHandler} from "@sveltejs/kit";

/**
 * GET handler for retrieving the current user's information
 */
export const GET: RequestHandler = async ({locals}) => {
  if (!locals.user) {
    return json({success: false, message: "Unauthorized"}, {status: 403});
  }

  try {
    // Return user info without sensitive data
    return json({
      success: true,
      user: {
        id: locals.user.id,
        name: locals.user.name,
        email: locals.user.email,
        type: locals.user.type,
        status: locals.user.status,
      },
    });
  } catch (error) {
    console.error("[API] Error getting user info:", error);

    return json(
      {
        success: false,
        message: error instanceof Error ? error.message : "An error occurred",
      },
      {status: 500}
    );
  }
};
