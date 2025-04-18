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
    console.log("Starting password reset fields migration...");

    // Add resetToken column to users table
    await client.execute(`
      ALTER TABLE users 
      ADD COLUMN reset_token TEXT;
    `);

    // Add resetTokenExpiry column to users table
    await client.execute(`
      ALTER TABLE users 
      ADD COLUMN reset_token_expiry INTEGER;
    `);

    // Create an index on reset_token column
    await client.execute(`
      CREATE INDEX IF NOT EXISTS reset_token_idx ON users(reset_token);
    `);

    console.log("Password reset fields migration completed successfully");
  } catch (error) {
    console.error("Error running password reset fields migration:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
