import { db } from "$lib/server/db";
import { users, type User } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { verifyUser } from "$lib/server/auth";
import { LockerService } from "./locker.service";

/**
 * AuthService provides functionality for user authentication and authorization
 */
export class AuthService {
  /**
   * Authenticate a user with email and password
   * @param email The user's email
   * @param password The user's password
   * @returns The authenticated user or null if authentication failed
   */
  public static async authenticate(
    email: string,
    password: string,
  ): Promise<User | null> {
    return verifyUser(email, password);
  }

  /**
   * Get active lockers for a user
   * Uses LockerService.getUserRentedLockers internally but maps the result
   * to maintain backward compatibility with existing code
   *
   * @param userId The user ID
   * @returns The user's active lockers
   */
  public static async getUserActiveLockers(userId: string): Promise<
    {
      id: string;
      number: string;
      size: string;
      subscription: {
        id: string;
        status: string;
        expiresAt: string;
      };
    }[]
  > {
    // Use the enhanced method from LockerService
    const rentedLockers = await LockerService.getUserRentedLockers(userId);

    // Map to the expected format for backward compatibility
    return rentedLockers.map(({ locker, subscription }) => ({
      id: locker.id,
      number: locker.number,
      size: locker.size,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        expiresAt: subscription.expiresAt,
      },
    }));
  }

  /**
   * Check if a user has admin rights
   * @param userId The user ID
   * @returns True if the user is an admin
   */
  public static async isAdmin(userId: string): Promise<boolean> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    return user?.type === "admin";
  }

  /**
   * Get user profile
   * @param userId The user ID
   * @returns The user profile or null if not found
   */
  public static async getUserProfile(userId: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    return user || null;
  }
}
