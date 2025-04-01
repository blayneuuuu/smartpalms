import { createClient } from "@libsql/client";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { readFileSync } from "fs";
import { join } from "path";
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
    console.log("Starting unverified users migration...");

    // Create unverified_users table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS unverified_users (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        verification_token TEXT NOT NULL,
        token_expiry INTEGER NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (CURRENT_TIMESTAMP)
      );
    `);

    // Create indices
    await client.execute(
      `CREATE INDEX IF NOT EXISTS unverified_email_idx ON unverified_users (email);`,
    );
    await client.execute(
      `CREATE INDEX IF NOT EXISTS token_idx ON unverified_users (verification_token);`,
    );

    console.log("Unverified users table migration completed successfully");
  } catch (error) {
    console.error("Error running unverified users migration:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
