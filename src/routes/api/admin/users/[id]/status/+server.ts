import {json} from "@sveltejs/kit";
import type {RequestHandler} from "./$types";
import {directClient} from "$lib/db/direct-client";
import crypto from "crypto";

export const PATCH: RequestHandler = async ({request, params, locals}) => {
  // Check if user is admin
  if (!locals.user || locals.user.type !== "admin") {
    return json({success: false, message: "Unauthorized"}, {status: 403});
  }

  const userId = params.id;
  if (!userId) {
    return json({success: false, message: "Missing user ID"}, {status: 400});
  }

  try {
    // Get request body
    const body = await request.json();
    const {status} = body;

    // Validate status
    const validStatuses = [
      "inactive",
      "subscribed",
      "for_renewal",
      "suspended",
      "blocked",
    ];
    if (!status || !validStatuses.includes(status)) {
      return json(
        {success: false, message: "Invalid status value"},
        {status: 400}
      );
    }

    // Get current user status
    const userResult = await directClient.execute({
      sql: "SELECT status FROM users WHERE id = ?",
      args: [userId],
    });

    if (userResult.rows.length === 0) {
      return json({success: false, message: "User not found"}, {status: 404});
    }

    const oldStatus = userResult.rows[0].status;

    // Update user status using the direct client
    await directClient.execute({
      sql: `UPDATE users SET status = ? WHERE id = ?`,
      args: [status, userId],
    });

    // Log the status change
    await directClient.execute({
      sql: `
        INSERT INTO user_status_log (
          id, user_id, old_status, new_status, changed_at
        ) VALUES (?, ?, ?, ?, strftime('%s', 'now'))
      `,
      args: [crypto.randomUUID(), userId, oldStatus || "unknown", status],
    });

    return json({
      success: true,
      message: "User status updated successfully",
    });
  } catch (error) {
    console.error("[API] Error updating user status:", error);
    return json(
      {success: false, message: "An error occurred while updating user status"},
      {status: 500}
    );
  }
};
