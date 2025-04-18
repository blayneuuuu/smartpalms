import {db} from "$lib/server/db";
import {subscriptions, lockers, users} from "$lib/server/db/schema";
import {eq, and, lt, isNotNull, gte} from "drizzle-orm";
import {UserService} from "$lib/services/core/user.service";

/**
 * Service for handling subscription-related operations
 */
export class SubscriptionService {
  /**
   * Check for expired subscriptions and update them
   * @param userId Optional user ID to check only subscriptions for a specific user
   * @returns Number of expired subscriptions that were updated
   */
  public static async checkAndUpdateExpiredSubscriptions(
    userId?: string
  ): Promise<number> {
    const now = new Date().toISOString();

    // Build the where clause
    let whereClause = and(
      eq(subscriptions.status, "active"),
      lt(subscriptions.expiresAt, now)
    );

    // Add user filter if provided
    if (userId) {
      whereClause = and(whereClause, eq(subscriptions.userId, userId));
    }

    // Fetch expired subscriptions
    const expiredSubscriptions = await db
      .select({
        id: subscriptions.id,
        lockerId: subscriptions.lockerId,
        userId: subscriptions.userId, // Add userId for status updates
      })
      .from(subscriptions)
      .where(whereClause);

    console.log(
      `Found ${expiredSubscriptions.length} expired subscriptions to update`
    );

    // No expired subscriptions
    if (expiredSubscriptions.length === 0) {
      return 0;
    }

    // Update each expired subscription and its locker
    await db.transaction(async (tx) => {
      // Update all expired subscriptions to 'expired' status
      await tx
        .update(subscriptions)
        .set({status: "expired"})
        .where(whereClause);

      // For each expired subscription, update the corresponding locker
      for (const sub of expiredSubscriptions) {
        await tx
          .update(lockers)
          .set({
            isOccupied: false,
            userId: null,
          })
          .where(eq(lockers.id, sub.lockerId));
      }
    });

    // Track unique users with expired subscriptions for status updates
    const affectedUserIds = new Set<string>();
    expiredSubscriptions.forEach((sub) => affectedUserIds.add(sub.userId));

    console.log(`Updating statuses for ${affectedUserIds.size} affected users`);

    // Update user statuses based on their remaining subscriptions
    const statusUpdatePromises = Array.from(affectedUserIds).map(
      async (userId) => {
        const result =
          await UserService.updateUserStatusBasedOnSubscriptions(userId);
        console.log(
          `User ${userId} status update after subscription expiry: ${
            result.success
              ? `Successfully updated to ${result.status}`
              : `Failed: ${result.error}`
          }`
        );
        return result.success;
      }
    );

    const statusUpdateResults = await Promise.all(statusUpdatePromises);
    const successfulStatusUpdates = statusUpdateResults.filter(
      (success) => success
    ).length;
    console.log(
      `Successfully updated ${successfulStatusUpdates} user statuses`
    );

    return expiredSubscriptions.length;
  }

  /**
   * Check for expired OTPs and remove them
   * @returns Number of expired OTPs that were removed
   */
  public static async checkAndRemoveExpiredOTPs(): Promise<number> {
    // Assuming OTPs expire after 10 minutes
    const otpExpiryMinutes = 10;
    const otpExpiryTime = new Date();
    otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() - otpExpiryMinutes);

    // Find lockers with non-null OTPs
    const lockersWithOTP = await db
      .select({
        id: lockers.id,
        otp: lockers.otp,
        updatedAt: lockers.createdAt, // Using createdAt as a proxy since there's no updatedAt for OTP
      })
      .from(lockers)
      .where(
        // Only consider lockers where OTP is not null
        isNotNull(lockers.otp)
      );

    // Check how many OTPs need to be expired based on time
    // Since we don't store OTP creation time, we can't accurately determine
    // which OTPs are expired. In a real system, we should add an otpCreatedAt field.
    // For now, we'll just clear all OTPs found, assuming they might be expired.

    const count = lockersWithOTP.length;
    console.log(`Found ${count} lockers with OTPs to clear`);

    if (count > 0) {
      // Clear all OTPs
      await db.update(lockers).set({otp: null}).where(isNotNull(lockers.otp));
    }

    return count;
  }

  /**
   * Find subscriptions that will expire within the day
   * @returns Array of subscriptions with user information
   */
  public static async findSubscriptionsExpiringToday(): Promise<
    Array<{
      subscriptionId: string;
      userId: string;
      userName: string;
      userEmail: string;
      lockerId: string;
      lockerNumber: string;
      expiresAt: string;
    }>
  > {
    // Get today's date at the start of the day (midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get tomorrow's date at the start of the day (midnight)
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Format dates for SQLite comparison
    const todayStr = today.toISOString();
    const tomorrowStr = tomorrow.toISOString();

    console.log(
      `Looking for subscriptions expiring between ${todayStr} and ${tomorrowStr}`
    );

    // Join users and lockers to get full information
    const expiringSubscriptions = await db
      .select({
        subscriptionId: subscriptions.id,
        userId: subscriptions.userId,
        userName: users.name,
        userEmail: users.email,
        lockerId: subscriptions.lockerId,
        lockerNumber: lockers.number,
        expiresAt: subscriptions.expiresAt,
      })
      .from(subscriptions)
      .innerJoin(users, eq(subscriptions.userId, users.id))
      .innerJoin(lockers, eq(subscriptions.lockerId, lockers.id))
      .where(
        and(
          eq(subscriptions.status, "active"),
          // Expires on this day (between start of today and start of tomorrow)
          gte(subscriptions.expiresAt, todayStr),
          lt(subscriptions.expiresAt, tomorrowStr)
        )
      );

    console.log(
      `Found ${expiringSubscriptions.length} subscriptions expiring today`
    );

    return expiringSubscriptions;
  }

  /**
   * Create a new subscription
   * @param data Subscription data
   * @returns Created subscription ID
   */
  public static async createSubscription(data: {
    userId: string;
    lockerId: string;
    expiresAt: string;
  }): Promise<string> {
    try {
      // Create subscription
      const [subscription] = await db
        .insert(subscriptions)
        .values({
          id: crypto.randomUUID(),
          userId: data.userId,
          lockerId: data.lockerId,
          status: "active",
          expiresAt: data.expiresAt,
          createdAt: new Date(),
        })
        .returning();

      // Update locker status
      await db
        .update(lockers)
        .set({
          userId: data.userId,
          isOccupied: true,
        })
        .where(eq(lockers.id, data.lockerId));

      // Update user status to reflect the new subscription
      await UserService.updateUserStatusBasedOnSubscriptions(data.userId);

      return subscription.id;
    } catch (error) {
      console.error("Error creating subscription:", error);
      throw error;
    }
  }
}
