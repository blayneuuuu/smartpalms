import {json} from "@sveltejs/kit";
import type {RequestHandler} from "@sveltejs/kit";
import {MessageService} from "$lib/services/core/message.service";

/**
 * POST handler for users to create a new message
 */
export const POST: RequestHandler = async ({request, locals}) => {
  // Check if user is authenticated
  if (!locals.user) {
    return json({success: false, message: "Unauthorized"}, {status: 403});
  }

  try {
    // Get request body
    const body = await request.json();
    const {content, lockerId} = body;

    if (!content || typeof content !== "string" || content.trim() === "") {
      return json(
        {success: false, message: "Content is required"},
        {status: 400}
      );
    }

    // Create message
    const message = await MessageService.createMessage({
      userId: locals.user.id,
      content: content.trim(),
      lockerId: lockerId || undefined,
      createdBy: locals.user.id,
    });

    return json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    console.error("[API] Error creating message:", error);

    return json(
      {
        success: false,
        message: error instanceof Error ? error.message : "An error occurred",
      },
      {status: 500}
    );
  }
};

/**
 * GET handler for users to get their message threads
 */
export const GET: RequestHandler = async ({locals}) => {
  // Check if user is authenticated
  if (!locals.user) {
    return json({success: false, message: "Unauthorized"}, {status: 403});
  }

  try {
    // Get user's message threads
    const threads = await MessageService.getThreadsForUser(locals.user.id);

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
