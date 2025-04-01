import { db } from "$lib/server/db";
import {
  lockers,
  accessHistory,
  subscriptions,
  type Locker,
  type AccessHistory,
  type Subscription,
} from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * LockerService provides functionality for managing lockers and their access
 */
export class LockerService {
  /**
   * Get a locker by its ID
   * @param id The locker ID
   * @returns The locker or null if not found
   */
  public static async getLockerById(id: string): Promise<Locker | null> {
    const [locker] = await db.select().from(lockers).where(eq(lockers.id, id));

    return locker || null;
  }

  /**
   * Get all lockers
   * @returns Array of all lockers
   */
  public static async getAllLockers(): Promise<Locker[]> {
    return db.select().from(lockers);
  }

  /**
   * Get all rented lockers for a user with detailed information
   * @param userId The user ID
   * @returns Array of lockers with subscription details
   */
  public static async getUserRentedLockers(userId: string): Promise<
    {
      locker: Locker;
      subscription: Subscription;
      daysUntilExpiration: number;
    }[]
  > {
    const result = await db
      .select({
        locker: lockers,
        subscription: subscriptions,
      })
      .from(lockers)
      .innerJoin(subscriptions, eq(lockers.id, subscriptions.lockerId))
      .where(
        and(
          eq(subscriptions.userId, userId),
          eq(subscriptions.status, "active"),
        ),
      );

    return result.map(({ locker, subscription }) => {
      // Calculate days until expiration
      const expiresAt = new Date(subscription.expiresAt);
      const today = new Date();
      const diffTime = expiresAt.getTime() - today.getTime();
      const daysUntilExpiration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        locker,
        subscription,
        daysUntilExpiration,
      };
    });
  }

  /**
   * Record access attempt to a locker
   * @param lockerId The locker ID
   * @param accessType The type of access (otp or subscription)
   * @param status Whether the access was successful
   * @param userId Optional user ID
   * @param otp Optional OTP used for access
   */
  public static async recordAccess(
    lockerId: string,
    accessType: "otp" | "subscription",
    status: "success" | "failed",
    userId?: string,
    otp?: string,
  ): Promise<void> {
    await db.insert(accessHistory).values({
      id: crypto.randomUUID(),
      lockerId,
      accessType,
      status,
      userId,
      otp,
    });
  }

  /**
   * Direct access to a locker without authentication
   * Used by hardware devices
   * @param lockerId The locker ID
   * @returns The locker if found and access is granted
   */
  public static async directAccess(
    lockerId: string,
  ): Promise<{ success: boolean; locker?: Locker }> {
    const locker = await this.getLockerById(lockerId);

    if (!locker) {
      // Record failed access
      await this.recordAccess(lockerId, "otp", "failed");
      return { success: false };
    }

    // Record successful access
    await this.recordAccess(lockerId, "otp", "success");

    return {
      success: true,
      locker,
    };
  }

  /**
   * Generate an OTP for a locker
   * @param lockerId The locker ID
   * @returns The generated OTP and its expiry date
   */
  public static async generateOTP(
    lockerId: string,
  ): Promise<{ otp: string; expiryDate: string }> {
    const locker = await this.getLockerById(lockerId);

    if (!locker) {
      throw new Error("Locker not found");
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiry to 10 minutes from now
    const expiryDate = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Save OTP to the locker
    await db.update(lockers).set({ otp }).where(eq(lockers.id, lockerId));

    return { otp, expiryDate };
  }

  /**
   * Get access history for a locker
   * @param lockerId The locker ID
   * @returns Array of access history entries
   */
  public static async getLockerAccessHistory(
    lockerId: string,
  ): Promise<AccessHistory[]> {
    return db
      .select()
      .from(accessHistory)
      .where(eq(accessHistory.lockerId, lockerId))
      .orderBy(accessHistory.accessedAt);
  }
}
