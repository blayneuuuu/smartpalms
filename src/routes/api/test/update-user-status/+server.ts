import {json} from "@sveltejs/kit";
import type {RequestHandler} from "@sveltejs/kit";
import {db} from "$lib/server/db";
import {users} from "$lib/server/db/schema";
import {eq} from "drizzle-orm";
import {dev} from "$app/environment";
import {UserService} from "$lib/services/core/user.service";

/**
 * Test endpoint to manually update a user's status based on subscriptions
 * Useful for testing the status update functionality
 * Only available in development mode
 */
export const GET: RequestHandler = async ({url}) => {
  try {
    // Only allow in development mode
    if (!dev) {
      return json(
        {
          success: false,
          message: "This endpoint is only available in development mode",
        },
        {status: 403}
      );
    }

    // Get user ID from URL parameter, default to updating all users if not provided
    const userId = url.searchParams.get("userId");

    let results = {};

    if (userId) {
      // Get the user
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .get();
      if (!user) {
        return json(
          {
            success: false,
            message: `User with ID ${userId} not found`,
          },
          {status: 404}
        );
      }

      console.log(`Updating status for user: ${user.name} (${user.email})`);

      // Update the specific user's status
      const oldStatus = user.status;
      const updated =
        await UserService.updateUserStatusBasedOnSubscriptions(userId);

      results = {
        userId,
        name: user.name,
        email: user.email,
        oldStatus,
        newStatus: updated.success ? updated.status : "unchanged",
      };
    } else {
      // Batch update all user statuses
      console.log("Batch updating all user statuses...");
      const updateCount = await UserService.batchUpdateUserStatuses();

      results = {
        message: "Batch update completed",
        updatedCount: updateCount,
      };
    }

    return json({
      success: true,
      message: "Status update operation completed",
      results,
    });
  } catch (error) {
    console.error("Error updating user status:", error);

    return json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      {status: 500}
    );
  }
};
