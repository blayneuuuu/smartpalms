import {createClient} from "@libsql/client";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Access environment variables
const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_AUTH_TOKEN = process.env.DATABASE_AUTH_TOKEN;

if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  throw new Error("DATABASE_URL environment variable is not set");
}

// Create a direct database client for operations not covered by Drizzle ORM
export const directClient = createClient({
  url: DATABASE_URL,
  authToken: DATABASE_AUTH_TOKEN,
});

/**
 * Sets a user's status to 'inactive'
 * @param userId The ID of the user to update
 * @returns Promise<boolean> True if successful, false otherwise
 */
export async function setUserStatusToInactive(
  userId: string
): Promise<boolean> {
  try {
    await directClient.execute({
      sql: `UPDATE users SET status = 'inactive' WHERE id = ?`,
      args: [userId],
    });

    return true;
  } catch (error) {
    console.error("[DIRECT_DB] Error setting user status to inactive:", error);
    return false;
  }
}

/**
 * Gets a user's current status
 * @param userId The ID of the user
 * @returns Promise<string | null> The user's status or null if not found
 */
export async function getUserStatus(userId: string): Promise<string | null> {
  try {
    const result = await directClient.execute({
      sql: `SELECT status FROM users WHERE id = ?`,
      args: [userId],
    });

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0].status as string;
  } catch (error) {
    console.error("[DIRECT_DB] Error getting user status:", error);
    return null;
  }
}
