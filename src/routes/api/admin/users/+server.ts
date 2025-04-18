import {json} from "@sveltejs/kit";
import type {RequestHandler} from "./$types";
import {db} from "$lib/server/db";
import {users} from "$lib/server/db/schema";

export const GET: RequestHandler = async ({locals, url}) => {
  try {
    if (!locals.user || locals.user.type !== "admin") {
      return json(
        {authenticated: false, message: "User is not an admin."},
        {status: 403}
      );
    }

    // Check if we should force refresh of latest data
    const shouldRefresh = url.searchParams.get("refresh") === "true";

    if (shouldRefresh) {
      console.log("Forcing fresh data fetch for users");
    }

    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        type: users.type,
        status: users.status,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .orderBy(users.createdAt);

    // Debug log the timestamps and statuses
    console.log("Raw users data from database:");
    allUsers.forEach((user) => {
      console.log(
        `User ${user.email} created at:`,
        user.createdAt,
        `status:`,
        user.status
      );
    });

    // Process timestamps ensuring they're in a consistent format
    const processedUsers = allUsers.map((user) => {
      let processedTimestamp: string | number = "";
      const timestamp = user.createdAt;

      try {
        // Convert to string for output no matter what format we have
        if (timestamp instanceof Date) {
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
            const timestampStr = String(timestamp);
            let dateObj = new Date(timestampStr);

            // Second attempt: If first attempt failed and string contains a space
            if (isNaN(dateObj.getTime()) && timestampStr.includes(" ")) {
              // Try replacing space with T for ISO format
              dateObj = new Date(timestampStr.replace(" ", "T"));
            }

            if (!isNaN(dateObj.getTime())) {
              processedTimestamp = dateObj.toISOString();
            } else {
              processedTimestamp = timestampStr;
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
        // Fallback to original value
        processedTimestamp = String(timestamp);
      }

      return {
        ...user,
        createdAt: processedTimestamp,
        updatedAt: user.updatedAt ? String(user.updatedAt) : "",
      };
    });

    return json({users: processedUsers});
  } catch (error) {
    console.error("Error fetching users:", error);
    return json({message: "Failed to fetch users"}, {status: 500});
  }
};
