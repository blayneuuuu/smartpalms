import type {Client} from "@libsql/client";

export async function up(db: Client): Promise<void> {
  // Add resetToken and resetTokenExpiry columns to the users table
  await db.execute(`
    ALTER TABLE users 
    ADD COLUMN reset_token TEXT;
  `);

  await db.execute(`
    ALTER TABLE users 
    ADD COLUMN reset_token_expiry INTEGER;
  `);

  // Create an index on the reset_token column for faster lookups
  await db.execute(`
    CREATE INDEX IF NOT EXISTS reset_token_idx ON users(reset_token);
  `);

  console.log("Migration 2: Added password reset fields to users table");
}

// This function is required by the migration system
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down(db: Client): Promise<void> {
  // SQLite doesn't support dropping columns directly
  // We would need to recreate the table, but this is risky in production
  // Just log the action needed
  console.log(
    "Migration 2 down: Manual action required to remove reset_token and reset_token_expiry columns"
  );
}
