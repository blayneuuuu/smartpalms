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
    console.log("Starting schema update for user status...");

    // 1. Add 'inactive' as a valid status value
    console.log("Checking and updating users with default status...");

    // 2. Change any unassigned users with 'subscribed' status to 'inactive'
    const result = await client.execute(`
      UPDATE users
      SET status = 'inactive'
      WHERE status = 'subscribed'
      AND id NOT IN (
        SELECT DISTINCT user_id FROM subscriptions WHERE status = 'active'
      );
    `);

    console.log(
      `Updated ${result.rowsAffected} users from 'subscribed' to 'inactive' status.`
    );

    // 3. For testing, list all user statuses
    const userStats = await client.execute(`
      SELECT status, COUNT(*) as count
      FROM users
      GROUP BY status;
    `);

    console.log("Current user status distribution:");
    userStats.rows.forEach((row) => {
      console.log(`- ${row.status}: ${row.count} users`);
    });

    console.log("User status schema update completed successfully");
  } catch (error) {
    console.error("Error updating user schema:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
