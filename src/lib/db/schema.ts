import {sqliteTable, text, integer, index} from "drizzle-orm/sqlite-core";
import {sql} from "drizzle-orm";

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    type: text("type", {enum: ["admin", "user"]})
      .notNull()
      .default("user"),
    createdAt: integer("created_at", {mode: "timestamp"})
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updated_at", {mode: "timestamp"})
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    emailIdx: index("email_idx").on(table.email),
    typeIdx: index("type_idx").on(table.type),
  })
);

// Unverified Users table
export const unverifiedUsers = sqliteTable(
  "unverified_users",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    verificationToken: text("verification_token").notNull(),
    tokenExpiry: integer("token_expiry", {mode: "timestamp"}).notNull(),
    createdAt: integer("created_at", {mode: "timestamp"})
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    emailIdx: index("unverified_email_idx").on(table.email),
    tokenIdx: index("token_idx").on(table.verificationToken),
  })
);

// Lockers table
export const lockers = sqliteTable(
  "lockers",
  {
    id: text("id").primaryKey(),
    number: text("number").notNull().unique(),
    size: text("size", {enum: ["small", "medium", "large"]}).notNull(),
    isOccupied: integer("is_occupied", {mode: "boolean"})
      .notNull()
      .default(false),
    userId: text("user_id").references(() => users.id),
    otp: text("otp"),
    last_accessed_at: integer("last_accessed_at", {mode: "timestamp"}),
    otp_expires_at: integer("otp_expires_at", {mode: "timestamp"}),
    createdAt: integer("created_at", {mode: "timestamp"})
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    numberIdx: index("number_idx").on(table.number),
    userIdIdx: index("locker_user_id_idx").on(table.userId),
    sizeIdx: index("size_idx").on(table.size),
  })
);
