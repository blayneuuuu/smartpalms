import {json} from "@sveltejs/kit";
import type {RequestHandler} from "@sveltejs/kit";
import {MessageService} from "$lib/services/core/message.service";

/**
 * PATCH handler for marking a message as read
 */
export const PATCH: RequestHandler = async ({params, locals}) => {
  // Check if user is admin
  if (!locals.user || locals.user.type !== "admin") {
    return json({success: false, message: "Unauthorized"}, {status: 403});
  }

  const messageId = params.id;
  if (!messageId) {
    return json(
      {success: false, message: "Message ID is required"},
      {status: 400}
    );
  }

  try {
    // Mark the message as read
    const success = await MessageService.markAsRead(messageId);

    if (!success) {
      return json(
        {success: false, message: "Failed to mark message as read"},
        {status: 500}
      );
    }

    return json({
      success: true,
      message: "Message marked as read",
    });
  } catch (error) {
    console.error("[API] Error marking message as read:", error);

    return json(
      {
        success: false,
        message: error instanceof Error ? error.message : "An error occurred",
      },
      {status: 500}
    );
  }
};
