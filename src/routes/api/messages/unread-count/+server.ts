import {json} from "@sveltejs/kit";
import type {RequestHandler} from "@sveltejs/kit";
import {MessageService} from "$lib/services/core/message.service";

/**
 * GET handler for getting the count of unread messages for a user
 */
export const GET: RequestHandler = async ({locals}) => {
  // Check if user is authenticated
  if (!locals.user) {
    return json({success: false, message: "Unauthorized"}, {status: 403});
  }

  try {
    // Get unread count
    const count = await MessageService.getUnreadCount(locals.user.id);

    return json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("[API] Error getting unread message count:", error);

    return json(
      {
        success: false,
        message: error instanceof Error ? error.message : "An error occurred",
      },
      {status: 500}
    );
  }
};
