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
    console.log("Starting user_status_log table migration...");

    // Create the user_status_log table if it doesn't exist
    await client.execute(`
      CREATE TABLE IF NOT EXISTS user_status_log (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        old_status TEXT NOT NULL,
        new_status TEXT NOT NULL,
        changed_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Create an index on user_id for faster lookups
    await client.execute(`
      CREATE INDEX IF NOT EXISTS user_status_log_user_id_idx ON user_status_log(user_id);
    `);

    // Create an index on changed_at for faster queries
    await client.execute(`
      CREATE INDEX IF NOT EXISTS user_status_log_changed_at_idx ON user_status_log(changed_at);
    `);

    console.log("User status log table migration completed successfully");
  } catch (error) {
    console.error("Error creating user_status_log table:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
