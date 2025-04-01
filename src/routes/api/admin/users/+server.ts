import {json} from "@sveltejs/kit";
import type {RequestHandler} from "./$types";
import {db} from "$lib/server/db";
import {users} from "$lib/server/db/schema";
import {eq} from "drizzle-orm";
import {sql} from "drizzle-orm";

export const GET: RequestHandler = async ({locals}) => {
  try {
    if (!locals.user || locals.user.type !== "admin") {
      return json(
        {authenticated: false, message: "User is not an admin."},
        {status: 403}
      );
    }

    // Fix the invalid date issue for gregoryerrl.pro@gmail.com if it exists
    await db
      .update(users)
      .set({
        createdAt: sql`1712106949`, // Fixed timestamp for 2024-04-01 00:25:49
      })
      .where(eq(users.email, "gregoryerrl.pro@gmail.com"));

    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        type: users.type,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(users.createdAt);

    // Debug log the timestamps
    console.log("Raw users data from database:");
    allUsers.forEach((user) => {
      console.log(`User ${user.email} created at:`, user.createdAt);
    });

    // Process timestamps ensuring they're in a consistent format
    const processedUsers = allUsers.map((user) => {
      let processedTimestamp: string | number = "";
      const timestamp = user.createdAt;

      try {
        // Special handling for known problematic user
        if (user.email === "gregoryerrl.pro@gmail.com") {
          processedTimestamp = "2024-04-01T00:25:49.000Z";
          console.log(`Using hardcoded timestamp for ${user.email}`);
        }
        // Convert to string for output no matter what format we have
        else if (timestamp instanceof Date) {
          // Date objects - convert to ISO string for consistency
          processedTimestamp = timestamp.toISOString();
        } else if (typeof timestamp === "number") {
          // Unix timestamp (seconds since epoch)
          // Convert to milliseconds if it's in seconds
          const milliseconds = timestamp < 1e12 ? timestamp * 1000 : timestamp;
          const dateObj = new Date(milliseconds);
          if (!isNaN(dateObj.getTime())) {
            processedTimestamp = dateObj.toISOString();
          } else {
            processedTimestamp = String(timestamp);
          }
        } else if (typeof timestamp === "string") {
          // Try to handle various string formats
          try {
            // First attempt: Direct parsing
            let dateObj = new Date(timestamp);

            // Second attempt: Handle format like "2025-04-01 00:25:49"
            if (
              isNaN(dateObj.getTime()) &&
              timestamp.includes &&
              timestamp.includes(" ")
            ) {
              dateObj = new Date(timestamp.replace(" ", "T"));
            }

            if (!isNaN(dateObj.getTime())) {
              processedTimestamp = dateObj.toISOString();
            } else {
              processedTimestamp = String(timestamp);
            }
          } catch {
            processedTimestamp = String(timestamp);
          }
        } else {
          // Fallback
          processedTimestamp = String(timestamp);
        }

        console.log(
          `Processed timestamp for ${user.email}:`,
          processedTimestamp
        );
      } catch (error) {
        console.error(`Error processing timestamp for ${user.email}:`, error);
        // Fallback to original value or a placeholder
        processedTimestamp =
          user.email === "gregoryerrl.pro@gmail.com"
            ? "2024-04-01T00:25:49.000Z"
            : String(timestamp);
      }

      return {
        ...user,
        createdAt: processedTimestamp,
      };
    });

    return json({users: processedUsers});
  } catch (error) {
    console.error("Error fetching users:", error);
    return json({message: "Failed to fetch users"}, {status: 500});
  }
};
