import {json} from "@sveltejs/kit";
import type {RequestHandler} from "@sveltejs/kit";
import {MessageService} from "$lib/services/core/message.service";

/**
 * GET handler for fetching all message threads for admin users
 */
export const GET: RequestHandler = async ({locals}) => {
  // Check if user is admin
  if (!locals.user || locals.user.type !== "admin") {
    return json({success: false, message: "Unauthorized"}, {status: 403});
  }

  try {
    // Get all message threads
    const threads = await MessageService.getAllThreadsForAdmin();

    return json({
      success: true,
      threads,
    });
  } catch (error) {
    console.error("[API] Error fetching messages:", error);

    return json(
      {
        success: false,
        message: error instanceof Error ? error.message : "An error occurred",
      },
      {status: 500}
    );
  }
};
