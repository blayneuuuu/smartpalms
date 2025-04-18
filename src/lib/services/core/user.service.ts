import {db} from "$lib/server/db";
import {users, subscriptions} from "$lib/server/db/schema";
import {eq, and, ne, sql} from "drizzle-orm";
import {directClient} from "$lib/db/direct-client";
import crypto from "crypto";

// Import UserStatus type from schema to ensure compatibility
import type {UserStatus} from "$lib/server/db/schema";

export interface StatusUpdateResult {
  success: boolean;
  status?: UserStatus;
  error?: string;
}

/**
 * Service for handling user-related operations
 */
export class UserService {
  /**
   * Updates a user's status based on their active subscriptions
   * - "inactive" if no active subscriptions
   * - "subscribed" if has active subscriptions
   * - "for_renewal" if has subscriptions expiring within 7 days
   */
  static async updateUserStatusBasedOnSubscriptions(
    userId: string
  ): Promise<StatusUpdateResult> {
    try {
      // Check if user exists
      const userExists = await db
        .select({id: users.id})
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!userExists.length) {
        return {
          success: false,
          error: `User with ID ${userId} not found`,
        };
      }

      // Get current status for logging
      const userResult = await db
        .select({
          status: users.status,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      const oldStatus = userResult[0]?.status || "inactive";

      // Get active subscriptions
      const activeSubscriptions = await db
        .select({
          id: subscriptions.id,
          expiresAt: subscriptions.expiresAt,
        })
        .from(subscriptions)
        .where(
          and(
            eq(subscriptions.userId, userId),
            eq(subscriptions.status, "active")
          )
        );

      let newStatus: UserStatus = "inactive";

      if (activeSubscriptions.length > 0) {
        // User has active subscriptions, mark as subscribed
        newStatus = "subscribed";

        // Check if any subscriptions are expiring soon (within 7 days)
        const now = new Date();
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(now.getDate() + 7);

        // Filter expiring subscriptions
        const expiringSubscriptions = activeSubscriptions.filter(
          (sub: {expiresAt: string}) => {
            const expiryDate = new Date(sub.expiresAt);
            return expiryDate <= sevenDaysFromNow;
          }
        );

        if (expiringSubscriptions.length > 0) {
          // User has subscriptions expiring within 7 days
          newStatus = "for_renewal";
        }
      }

      // Only update if status has changed
      if (newStatus !== oldStatus) {
        await db
          .update(users)
          .set({
            status: newStatus,
            updatedAt: sql`(strftime('%s', 'now'))`,
          })
          .where(eq(users.id, userId));

        // Log the status change
        await this.logStatusChange(userId, oldStatus, newStatus);

        console.log(
          `Updated user ${userId} status from ${oldStatus} to ${newStatus}`
        );
      }

      return {
        success: true,
        status: newStatus,
      };
    } catch (error) {
      console.error("Error updating user status:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Logs a change in user status to the user_status_log table
   */
  private static async logStatusChange(
    userId: string,
    oldStatus: string,
    newStatus: UserStatus
  ) {
    try {
      // Use the directClient to execute the SQL query
      await directClient.execute({
        sql: `
          INSERT INTO user_status_log (
            id, user_id, old_status, new_status, changed_at
          ) VALUES (?, ?, ?, ?, strftime('%s', 'now'))
        `,
        args: [crypto.randomUUID(), userId, oldStatus || "unknown", newStatus],
      });
    } catch (error) {
      // Just log the error but don't fail the overall operation
      console.error("Error logging user status change:", error);
    }
  }

  /**
   * Updates statuses for all users based on their subscriptions
   * Returns the number of users whose status was updated
   */
  static async batchUpdateUserStatuses(): Promise<number> {
    try {
      // Get all non-admin users
      const allUsers = await db
        .select({
          id: users.id,
        })
        .from(users)
        .where(ne(users.type, "admin"));

      let updatedCount = 0;

      // Update each user's status
      for (const user of allUsers) {
        const result = await this.updateUserStatusBasedOnSubscriptions(user.id);
        if (result.success) {
          updatedCount++;
        }
      }

      return updatedCount;
    } catch (error) {
      console.error("Error in batch update of user statuses:", error);
      return 0;
    }
  }
}
