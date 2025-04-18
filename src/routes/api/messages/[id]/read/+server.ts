import {json} from "@sveltejs/kit";
import type {RequestHandler} from "@sveltejs/kit";
import {MessageService} from "$lib/services/core/message.service";

/**
 * PATCH handler for marking a message as read
 */
export const PATCH: RequestHandler = async ({params, locals}) => {
  // Check if user is authenticated
  if (!locals.user) {
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
    // Get the message to verify ownership
    const message = await MessageService.getById(messageId);

    if (!message) {
      return json(
        {success: false, message: "Message not found"},
        {status: 404}
      );
    }

    // Check if the message belongs to the user
    if (message.userId !== locals.user.id) {
      return json({success: false, message: "Unauthorized"}, {status: 403});
    }

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
