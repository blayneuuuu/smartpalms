import {sql} from "drizzle-orm";
import {sqliteTable, text, integer} from "drizzle-orm/sqlite-core";

// A simplified schema for testing purposes
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: integer("created_at")
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});
