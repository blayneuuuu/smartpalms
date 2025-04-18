import {json} from "@sveltejs/kit";
import type {RequestHandler} from "@sveltejs/kit";
import {directClient} from "$lib/db/direct-client";

export const GET: RequestHandler = async ({locals}) => {
  // Check if user is admin
  if (!locals.user || locals.user.type !== "admin") {
    return json({success: false, message: "Unauthorized"}, {status: 403});
  }

  try {
    console.log("[ADMIN] Starting database fix operation");
    const results: Record<string, string | number | boolean> = {};

    // Step 1: Check for __old_push tables and drop them if they exist
    try {
      // Check for all __old_push tables
      const tableCheck = await directClient.execute({
        sql: `
          SELECT name FROM sqlite_master 
          WHERE type='table' AND name LIKE '__old_push%'
        `,
        args: [],
      });

      if (tableCheck.rows.length > 0) {
        console.log(
          `[ADMIN] Found ${tableCheck.rows.length} __old_push tables to clean up`
        );

        // Store table names
        results.oldTablesFound = tableCheck.rows.length;
        results.tables = tableCheck.rows.map((row) => row.name).join(", ");

        // Drop each table
        for (const row of tableCheck.rows) {
          const tableName = row.name;
          console.log(`[ADMIN] Dropping table: ${tableName}`);

          await directClient.execute({
            sql: `DROP TABLE IF EXISTS "${tableName}"`,
            args: [],
          });
        }

        results.tablesDropped = tableCheck.rows.length;
        results.status = "Tables successfully dropped";
      } else {
        console.log("[ADMIN] No __old_push tables found");
        results.oldTablesFound = 0;
        results.status = "No cleanup needed";
      }
    } catch (error) {
      console.error(
        "[ADMIN] Error checking/dropping __old_push tables:",
        error
      );
      results.tableDropError =
        error instanceof Error ? error.message : "Unknown error";
    }

    // Step 2: Verify subscription_types table
    try {
      const subscriptionTypeCheck = await directClient.execute({
        sql: `
          SELECT COUNT(*) as count FROM subscription_types
        `,
        args: [],
      });

      const count = subscriptionTypeCheck.rows[0]?.count;
      results.subscriptionTypesCount = typeof count === "number" ? count : 0;
      console.log(
        `[ADMIN] Found ${results.subscriptionTypesCount} subscription types`
      );
    } catch (error) {
      console.error("[ADMIN] Error checking subscription_types table:", error);
      results.subscriptionTypesError =
        error instanceof Error ? error.message : "Unknown error";

      // Try to create the table if it doesn't exist
      try {
        await directClient.execute({
          sql: `
            CREATE TABLE IF NOT EXISTS subscription_types (
              id TEXT PRIMARY KEY,
              name TEXT NOT NULL,
              duration TEXT NOT NULL,
              size TEXT NOT NULL,
              amount INTEGER NOT NULL,
              is_active INTEGER NOT NULL DEFAULT 1,
              created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
            )
          `,
          args: [],
        });

        results.subscriptionTypesCreated = true;
        console.log("[ADMIN] Created subscription_types table");
      } catch (createError) {
        console.error(
          "[ADMIN] Error creating subscription_types table:",
          createError
        );
        results.subscriptionTypesCreateError =
          createError instanceof Error ? createError.message : "Unknown error";
      }
    }

    return json({
      success: true,
      message: "Database fix operation completed",
      results,
    });
  } catch (error) {
    console.error("[ADMIN] Database fix error:", error);
    return json(
      {
        success: false,
        message: "An error occurred during database fix operation",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {status: 500}
    );
  }
};
