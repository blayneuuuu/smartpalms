import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { p as private_env } from "./shared-server.js";
import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
const admins = sqliteTable(
  "admins",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().unique(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`)
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId)
  })
);
const lockers = sqliteTable(
  "lockers",
  {
    id: text("id").primaryKey(),
    number: text("number").notNull().unique(),
    size: text("size", { enum: ["small", "medium", "large"] }).notNull(),
    userId: text("user_id"),
    // Nullable - if null, locker is available
    otp: text("otp"),
    isOccupied: integer("is_occupied", { mode: "boolean" }).notNull().default(false),
    lastAccessedAt: integer("last_accessed_at", { mode: "timestamp" })
  },
  (table) => ({
    numberIdx: index("number_idx").on(table.number),
    userIdIdx: index("locker_user_id_idx").on(table.userId),
    sizeIdx: index("size_idx").on(table.size)
  })
);
const lockerRequests = sqliteTable(
  "locker_requests",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    lockerId: text("locker_id").notNull().references(() => lockers.id),
    subscriptionTypeId: text("subscription_type_id").notNull().references(() => subscriptionTypes.id),
    status: text("status", {
      enum: ["pending", "approved", "rejected"]
    }).notNull().default("pending"),
    proofOfPayment: text("proof_of_payment", { length: 4294967295 }),
    rejectionReason: text("rejection_reason"),
    requestedAt: integer("requested_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
    processedAt: integer("processed_at", { mode: "timestamp" }),
    processedBy: text("processed_by").references(() => admins.id)
  },
  (table) => ({
    userIdIdx: index("request_user_id_idx").on(table.userId),
    lockerIdIdx: index("request_locker_id_idx").on(table.lockerId),
    statusIdx: index("request_status_idx").on(table.status),
    subscriptionTypeIdx: index("subscription_type_idx").on(
      table.subscriptionTypeId
    )
  })
);
const subscriptions = sqliteTable(
  "subscriptions",
  {
    id: text("id").primaryKey(),
    status: text("status", {
      enum: ["active", "expired", "cancelled"]
    }).notNull(),
    userId: text("user_id").notNull(),
    lockerId: text("locker_id").notNull().references(() => lockers.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
    expiresAt: text("expires_at").notNull()
  },
  (table) => ({
    userIdIdx: index("sub_user_id_idx").on(table.userId),
    lockerIdIdx: index("locker_id_idx").on(table.lockerId),
    statusIdx: index("status_idx").on(table.status)
  })
);
const transactions = sqliteTable(
  "transactions",
  {
    id: text("id").primaryKey(),
    amount: text("amount").notNull(),
    userId: text("user_id").notNull(),
    subscriptionId: text("subscription_id").references(() => subscriptions.id),
    status: text("status", { enum: ["success", "failed", "pending"] }).notNull(),
    proofOfPayment: text("proof_of_payment"),
    // Base64 image for proof of payment
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`)
  },
  (table) => ({
    userIdIdx: index("trans_user_id_idx").on(table.userId),
    subscriptionIdIdx: index("subscription_id_idx").on(table.subscriptionId),
    statusIdx: index("trans_status_idx").on(table.status)
  })
);
const subscriptionTypes = sqliteTable(
  "subscription_types",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    duration: text("duration", {
      enum: ["1_day", "7_days", "30_days"]
    }).notNull(),
    amount: integer("amount").notNull(),
    // Amount in cents (e.g., 5000 for 50 PHP)
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`)
  },
  (table) => ({
    durationIdx: index("duration_idx").on(table.duration)
  })
);
const schema = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  admins,
  lockerRequests,
  lockers,
  subscriptionTypes,
  subscriptions,
  transactions
}, Symbol.toStringTag, { value: "Module" }));
if (!private_env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
if (!private_env.DATABASE_AUTH_TOKEN)
  throw new Error("DATABASE_AUTH_TOKEN is not set");
const client = createClient({
  url: private_env.DATABASE_URL,
  authToken: private_env.DATABASE_AUTH_TOKEN
});
const db = drizzle(client, { schema });
export {
  admins as a,
  lockers as b,
  subscriptionTypes as c,
  db as d,
  lockerRequests as l,
  subscriptions as s,
  transactions as t
};
