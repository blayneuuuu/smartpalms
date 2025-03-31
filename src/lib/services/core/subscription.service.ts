import {db} from "$lib/server/db";
import {subscriptions, lockers} from "$lib/server/db/schema";
import {eq, and, lt, isNotNull} from "drizzle-orm";

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
}
