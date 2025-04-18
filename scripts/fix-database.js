import {createClient} from "@libsql/client";
import dotenv from "dotenv";
import crypto from "crypto";

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
    console.log("[DB-FIX] Starting database fix operation");
    const results = {};

    // Step 0: Check for foreign key constraints that reference non-existent tables
    try {
      console.log(
        "[DB-FIX] Checking for foreign key constraints to __old_push tables"
      );
      // Get list of all tables
      const tables = await client.execute(`
        SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '__old_push%'
      `);

      for (const table of tables.rows) {
        const tableName = table.name;
        console.log(`[DB-FIX] Checking foreign keys in table: ${tableName}`);

        // Get foreign key info for the table
        const pragmaFk = await client.execute(
          `PRAGMA foreign_key_list(${tableName})`
        );

        for (const fk of pragmaFk.rows) {
          if (fk.table && fk.table.startsWith("__old_push")) {
            console.log(
              `[DB-FIX] Found foreign key in ${tableName} referencing ${fk.table}`
            );
            results[`${tableName}_fk_issue`] = `References ${fk.table}`;
          }
        }
      }
    } catch (error) {
      console.error("[DB-FIX] Error checking foreign key constraints:", error);
    }

    // Step 1: Check for __old_push tables and drop them if they exist
    try {
      // Check for all __old_push tables
      const tableCheck = await client.execute(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name LIKE '__old_push%'
      `);

      if (tableCheck.rows.length > 0) {
        console.log(
          `[DB-FIX] Found ${tableCheck.rows.length} __old_push tables to clean up`
        );

        // Store table names
        results.oldTablesFound = tableCheck.rows.length;
        results.tables = tableCheck.rows.map((row) => row.name).join(", ");
        console.log(`[DB-FIX] Tables to drop: ${results.tables}`);

        // Drop each table
        for (const row of tableCheck.rows) {
          const tableName = row.name;
          console.log(`[DB-FIX] Dropping table: ${tableName}`);

          try {
            await client.execute(`DROP TABLE IF EXISTS "${tableName}"`);
            console.log(`[DB-FIX] Successfully dropped table: ${tableName}`);
          } catch (dropError) {
            console.error(
              `[DB-FIX] Failed to drop table ${tableName}:`,
              dropError
            );
          }
        }

        results.tablesDropped = tableCheck.rows.length;
        results.status = "Tables successfully dropped";
      } else {
        console.log("[DB-FIX] No __old_push tables found");
        results.oldTablesFound = 0;
        results.status = "No cleanup needed";
      }
    } catch (error) {
      console.error(
        "[DB-FIX] Error checking/dropping __old_push tables:",
        error
      );
      results.tableDropError =
        error instanceof Error ? error.message : "Unknown error";
    }

    // Step 2: Fix locker_requests table
    try {
      console.log("[DB-FIX] Checking locker_requests table structure");

      // Check if locker_requests table exists
      const lockerRequestsCheck = await client.execute(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name='locker_requests'
      `);

      if (lockerRequestsCheck.rows.length > 0) {
        console.log(
          "[DB-FIX] locker_requests table found, recreating with correct references"
        );

        // Save existing data
        const lockerRequestsData = await client.execute(
          `SELECT * FROM locker_requests`
        );
        console.log(
          `[DB-FIX] Saved ${lockerRequestsData.rows.length} locker requests`
        );

        // Create a temporary table with the correct structure
        await client.execute(`
          CREATE TABLE IF NOT EXISTS locker_requests_temp (
            id TEXT PRIMARY KEY NOT NULL,
            user_id TEXT NOT NULL,
            locker_id TEXT NOT NULL,
            subscription_type_id TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending',
            proof_of_payment TEXT,
            rejection_reason TEXT,
            requested_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
            processed_at INTEGER,
            processed_by TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (locker_id) REFERENCES lockers(id),
            FOREIGN KEY (subscription_type_id) REFERENCES subscription_types(id),
            FOREIGN KEY (processed_by) REFERENCES users(id)
          )
        `);

        if (lockerRequestsData.rows.length > 0) {
          // Reinsert data with valid references only
          for (const row of lockerRequestsData.rows) {
            try {
              await client.execute(
                `
                INSERT INTO locker_requests_temp (
                  id, user_id, locker_id, subscription_type_id, status, 
                  proof_of_payment, rejection_reason, requested_at, processed_at, processed_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `,
                [
                  row.id,
                  row.user_id,
                  row.locker_id,
                  row.subscription_type_id,
                  row.status,
                  row.proof_of_payment,
                  row.rejection_reason,
                  row.requested_at,
                  row.processed_at,
                  row.processed_by,
                ]
              );
            } catch (error) {
              console.error(`[DB-FIX] Error reinserting row ${row.id}:`, error);
            }
          }
        }

        // Replace the original table
        await client.execute(`DROP TABLE locker_requests`);
        await client.execute(
          `ALTER TABLE locker_requests_temp RENAME TO locker_requests`
        );

        // Recreate indices
        await client.execute(
          `CREATE INDEX IF NOT EXISTS request_user_id_idx ON locker_requests (user_id)`
        );
        await client.execute(
          `CREATE INDEX IF NOT EXISTS request_locker_id_idx ON locker_requests (locker_id)`
        );
        await client.execute(
          `CREATE INDEX IF NOT EXISTS request_status_idx ON locker_requests (status)`
        );
        await client.execute(
          `CREATE INDEX IF NOT EXISTS subscription_type_idx ON locker_requests (subscription_type_id)`
        );

        console.log(
          "[DB-FIX] Successfully recreated locker_requests table with proper references"
        );
        results.fixedLockerRequests = true;
      } else {
        console.log("[DB-FIX] locker_requests table not found");
      }
    } catch (error) {
      console.error("[DB-FIX] Error fixing locker_requests table:", error);
      results.lockerRequestsError = error.message;
    }

    // Step 3: Fix subscriptions table
    try {
      console.log("[DB-FIX] Checking subscriptions table structure");

      // Check if subscriptions table exists
      const subscriptionsCheck = await client.execute(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name='subscriptions'
      `);

      if (subscriptionsCheck.rows.length > 0) {
        console.log(
          "[DB-FIX] subscriptions table found, recreating with correct references"
        );

        // Save existing data
        const subscriptionsData = await client.execute(
          `SELECT * FROM subscriptions`
        );
        console.log(
          `[DB-FIX] Saved ${subscriptionsData.rows.length} subscriptions`
        );

        // Create a temporary table with the correct structure
        await client.execute(`
          CREATE TABLE IF NOT EXISTS subscriptions_temp (
            id TEXT PRIMARY KEY NOT NULL,
            status TEXT NOT NULL,
            user_id TEXT NOT NULL,
            locker_id TEXT NOT NULL,
            expires_at TEXT NOT NULL,
            created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (locker_id) REFERENCES lockers(id) ON DELETE CASCADE
          )
        `);

        if (subscriptionsData.rows.length > 0) {
          // Reinsert data with valid references only
          for (const row of subscriptionsData.rows) {
            try {
              await client.execute(
                `
                INSERT INTO subscriptions_temp (
                  id, status, user_id, locker_id, expires_at, created_at
                ) VALUES (?, ?, ?, ?, ?, ?)
              `,
                [
                  row.id,
                  row.status,
                  row.user_id,
                  row.locker_id,
                  row.expires_at,
                  row.created_at,
                ]
              );
            } catch (error) {
              console.error(
                `[DB-FIX] Error reinserting subscription ${row.id}:`,
                error
              );
            }
          }
        }

        // Replace the original table
        await client.execute(`DROP TABLE subscriptions`);
        await client.execute(
          `ALTER TABLE subscriptions_temp RENAME TO subscriptions`
        );

        // Recreate indices
        await client.execute(
          `CREATE INDEX IF NOT EXISTS sub_user_id_idx ON subscriptions (user_id)`
        );
        await client.execute(
          `CREATE INDEX IF NOT EXISTS locker_id_idx ON subscriptions (locker_id)`
        );
        await client.execute(
          `CREATE INDEX IF NOT EXISTS status_idx ON subscriptions (status)`
        );

        console.log(
          "[DB-FIX] Successfully recreated subscriptions table with proper references"
        );
        results.fixedSubscriptions = true;
      } else {
        console.log("[DB-FIX] subscriptions table not found");
      }
    } catch (error) {
      console.error("[DB-FIX] Error fixing subscriptions table:", error);
      results.subscriptionsError = error.message;
    }

    // Step 4: Fix transactions table that might reference __old_push_subscriptions
    try {
      console.log("[DB-FIX] Checking transactions table structure");

      // Check if transactions table exists
      const transactionsCheck = await client.execute(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name='transactions'
      `);

      if (transactionsCheck.rows.length > 0) {
        console.log(
          "[DB-FIX] transactions table found, recreating with correct references"
        );

        // Save existing data
        const transactionsData = await client.execute(
          `SELECT * FROM transactions`
        );
        console.log(
          `[DB-FIX] Saved ${transactionsData.rows.length} transactions`
        );

        // Create a temporary table with the correct structure
        await client.execute(`
          CREATE TABLE IF NOT EXISTS transactions_temp (
            id TEXT PRIMARY KEY NOT NULL,
            amount TEXT NOT NULL,
            user_id TEXT NOT NULL,
            subscription_id TEXT,
            status TEXT NOT NULL,
            proof_of_payment TEXT,
            created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (subscription_id) REFERENCES subscriptions(id)
          )
        `);

        if (transactionsData.rows.length > 0) {
          // Reinsert data with valid references only
          for (const row of transactionsData.rows) {
            // Check if this transaction reference an existing subscription
            let subscriptionExists = true;
            if (row.subscription_id) {
              const subCheck = await client.execute(
                `SELECT COUNT(*) as count FROM subscriptions WHERE id = ?`,
                [row.subscription_id]
              );
              subscriptionExists = subCheck.rows[0].count > 0;
            }

            try {
              await client.execute(
                `
                INSERT INTO transactions_temp (
                  id, amount, user_id, subscription_id, status, proof_of_payment, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
              `,
                [
                  row.id,
                  row.amount,
                  row.user_id,
                  subscriptionExists ? row.subscription_id : null,
                  row.status,
                  row.proof_of_payment,
                  row.created_at,
                ]
              );
            } catch (error) {
              console.error(
                `[DB-FIX] Error reinserting transaction ${row.id}:`,
                error
              );
            }
          }
        }

        // Replace the original table
        await client.execute(`DROP TABLE transactions`);
        await client.execute(
          `ALTER TABLE transactions_temp RENAME TO transactions`
        );

        // Recreate indices
        await client.execute(
          `CREATE INDEX IF NOT EXISTS trans_user_id_idx ON transactions (user_id)`
        );
        await client.execute(
          `CREATE INDEX IF NOT EXISTS subscription_id_idx ON transactions (subscription_id)`
        );
        await client.execute(
          `CREATE INDEX IF NOT EXISTS trans_status_idx ON transactions (status)`
        );

        console.log(
          "[DB-FIX] Successfully recreated transactions table with proper references"
        );
        results.fixedTransactions = true;
      } else {
        console.log("[DB-FIX] transactions table not found");
      }
    } catch (error) {
      console.error("[DB-FIX] Error fixing transactions table:", error);
      results.transactionsError = error.message;
    }

    console.log("[DB-FIX] Database fix completed with results:", results);
  } catch (error) {
    console.error("[DB-FIX] Database fix error:", error);
  } finally {
    await client.close();
  }
}

main();
