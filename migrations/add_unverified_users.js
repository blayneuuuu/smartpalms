import {createClient} from "@libsql/client";
import {fileURLToPath} from "url";
import {dirname} from "path";
import {readFileSync} from "fs";
import {join} from "path";

// Setup path for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables directly from file
const envPath = join(__dirname, "..", ".env");
const envContent = readFileSync(envPath, "utf8");
const env = {};

envContent.split("\n").forEach((line) => {
  const match = line.match(/^([^#][^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim();
    env[key] = value;
  }
});

async function main() {
  const client = createClient({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  });

  try {
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
      `CREATE INDEX IF NOT EXISTS unverified_email_idx ON unverified_users (email);`
    );
    await client.execute(
      `CREATE INDEX IF NOT EXISTS token_idx ON unverified_users (verification_token);`
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
