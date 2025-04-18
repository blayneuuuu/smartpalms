import {createClient} from "@libsql/client";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Access environment variables
const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_AUTH_TOKEN = process.env.DATABASE_AUTH_TOKEN;

if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

console.log("Creating LibSQL client with URL:", DATABASE_URL);

async function main() {
  const client = createClient({
    url: DATABASE_URL,
    authToken: DATABASE_AUTH_TOKEN,
  });

  try {
    console.log("Starting user status enforcement...");

    // Find users with 'subscribed' status but no active subscriptions - simplified query
    const wrongStatusUsers = await client.execute(
      `SELECT id, name, email, status FROM users WHERE status = 'subscribed'`
    );

    console.log(
      `Found ${wrongStatusUsers.rows.length} users with 'subscribed' status`
    );

    // List the users with incorrect status
    if (wrongStatusUsers.rows.length > 0) {
      console.log("Users with 'subscribed' status:");
      wrongStatusUsers.rows.forEach((user) => {
        console.log(`- ${user.email}: current status is '${user.status}'`);
      });
    }

    // Update all users with incorrect status
    if (wrongStatusUsers.rows.length > 0) {
      const updateResult = await client.execute(
        `UPDATE users SET status = 'inactive' WHERE status = 'subscribed'`
      );

      console.log(
        `Updated ${updateResult.rowsAffected} users from 'subscribed' to 'inactive'`
      );
    }

    // Create a table to track user status changes
    await client.execute(
      `CREATE TABLE IF NOT EXISTS user_status_log (
         id TEXT PRIMARY KEY,
         user_id TEXT NOT NULL,
         old_status TEXT NOT NULL,
         new_status TEXT NOT NULL,
         changed_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
         FOREIGN KEY (user_id) REFERENCES users(id)
       )`
    );

    console.log("User status enforcement completed successfully");
  } catch (error) {
    console.error("Error enforcing user status:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
