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
    console.log("Starting user status fix...");

    // Add the 'inactive' status if it's a valid option
    console.log("Checking and fixing user statuses...");

    // Get all users
    const users = await client.execute(`SELECT id, email, status FROM users`);
    console.log(`Found ${users.rows.length} users in the database`);

    // Display current user status
    console.log("Current user statuses:");
    users.rows.forEach((user) => {
      console.log(`- ${user.email}: ${user.status}`);
    });

    // Update users with 'subscribed' status to 'inactive' if they don't have an active subscription
    const updateResult = await client.execute(`
      UPDATE users
      SET status = 'inactive'
      WHERE status = 'subscribed'
      AND id NOT IN (
        SELECT DISTINCT user_id FROM subscriptions WHERE status = 'active'
      );
    `);

    console.log(
      `Updated ${updateResult.rowsAffected} users from 'subscribed' to 'inactive'`
    );

    // Display updated user status
    const updatedUsers = await client.execute(
      `SELECT id, email, status FROM users`
    );
    console.log("Updated user statuses:");
    updatedUsers.rows.forEach((user) => {
      console.log(`- ${user.email}: ${user.status}`);
    });

    // Check for any subscriptions
    const subs = await client.execute(
      `SELECT COUNT(*) as count FROM subscriptions`
    );
    console.log(`Found ${subs.rows[0].count} subscriptions in total`);

    const activeSubs = await client.execute(
      `SELECT COUNT(*) as count FROM subscriptions WHERE status = 'active'`
    );
    console.log(`Found ${activeSubs.rows[0].count} active subscriptions`);

    console.log("User status fix completed successfully");
  } catch (error) {
    console.error("Error fixing user status:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
