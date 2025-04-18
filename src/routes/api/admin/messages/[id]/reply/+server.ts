import {json} from "@sveltejs/kit";
import type {RequestHandler} from "@sveltejs/kit";
import {MessageService} from "$lib/services/core/message.service";

/**
 * POST handler for admin replying to a message
 */
export const POST: RequestHandler = async ({request, params, locals}) => {
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
    // Get the original message to determine user ID
    const originalMessage = await MessageService.getById(messageId);

    if (!originalMessage) {
      return json(
        {success: false, message: "Message not found"},
        {status: 404}
      );
    }

    // Get request body
    const body = await request.json();
    const {content} = body;

    if (!content || typeof content !== "string" || content.trim() === "") {
      return json(
        {success: false, message: "Content is required"},
        {status: 400}
      );
    }

    // Create reply message
    const reply = await MessageService.createMessage({
      userId: originalMessage.userId,
      content: content.trim(),
      lockerId: originalMessage.lockerId || undefined,
      parentId: messageId,
      createdBy: locals.user.id,
    });

    // Also mark the original message as read if it's not already
    if (!originalMessage.isRead) {
      await MessageService.markAsRead(messageId);
    }

    return json({
      success: true,
      message: "Reply sent successfully",
      reply,
    });
  } catch (error) {
    console.error("[API] Error replying to message:", error);

    return json(
      {
        success: false,
        message: error instanceof Error ? error.message : "An error occurred",
      },
      {status: 500}
    );
  }
};
