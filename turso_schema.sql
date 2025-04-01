-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT "user" CHECK(type IN ("admin", "user")),
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS email_idx ON users(email);
CREATE INDEX IF NOT EXISTS type_idx ON users(type);

-- Unverified Users table
CREATE TABLE IF NOT EXISTS unverified_users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  verification_token TEXT NOT NULL,
  token_expiry INTEGER NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS unverified_email_idx ON unverified_users(email);
CREATE INDEX IF NOT EXISTS token_idx ON unverified_users(verification_token);

-- Lockers table
CREATE TABLE IF NOT EXISTS lockers (
  id TEXT PRIMARY KEY,
  number TEXT NOT NULL UNIQUE,
  size TEXT NOT NULL CHECK(size IN ("small", "large")),
  is_occupied INTEGER NOT NULL DEFAULT 0,
  user_id TEXT REFERENCES users(id),
  otp TEXT,
  last_accessed_at INTEGER,
  otp_expires_at INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS number_idx ON lockers(number);
CREATE INDEX IF NOT EXISTS locker_user_id_idx ON lockers(user_id);
CREATE INDEX IF NOT EXISTS size_idx ON lockers(size);

-- Subscription Types table
CREATE TABLE IF NOT EXISTS subscription_types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  duration TEXT NOT NULL CHECK(duration IN ("1_day", "3_days", "7_days", "30_days")),
  size TEXT NOT NULL DEFAULT "small" CHECK(size IN ("small", "large")),
  amount INTEGER NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS duration_idx ON subscription_types(duration);
CREATE INDEX IF NOT EXISTS sub_type_size_idx ON subscription_types(size);

-- Locker Requests table
CREATE TABLE IF NOT EXISTS locker_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  locker_id TEXT NOT NULL REFERENCES lockers(id),
  subscription_type_id TEXT NOT NULL REFERENCES subscription_types(id),
  status TEXT NOT NULL DEFAULT "pending" CHECK(status IN ("pending", "approved", "rejected")),
  proof_of_payment TEXT,
  rejection_reason TEXT,
  requested_at INTEGER NOT NULL DEFAULT (unixepoch()),
  processed_at INTEGER,
  processed_by TEXT REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS request_user_id_idx ON locker_requests(user_id);
CREATE INDEX IF NOT EXISTS request_locker_id_idx ON locker_requests(locker_id);
CREATE INDEX IF NOT EXISTS request_status_idx ON locker_requests(status);
CREATE INDEX IF NOT EXISTS subscription_type_idx ON locker_requests(subscription_type_id);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL CHECK(status IN ("active", "expired", "cancelled")),
  user_id TEXT NOT NULL REFERENCES users(id),
  locker_id TEXT NOT NULL REFERENCES lockers(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS sub_user_id_idx ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS locker_id_idx ON subscriptions(locker_id);
CREATE INDEX IF NOT EXISTS status_idx ON subscriptions(status);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  amount TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id),
  subscription_id TEXT REFERENCES subscriptions(id),
  status TEXT NOT NULL CHECK(status IN ("success", "failed", "pending")),
  proof_of_payment TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS trans_user_id_idx ON transactions(user_id);
CREATE INDEX IF NOT EXISTS subscription_id_idx ON transactions(subscription_id);
CREATE INDEX IF NOT EXISTS trans_status_idx ON transactions(status);

-- Access History table
CREATE TABLE IF NOT EXISTS access_history (
  id TEXT PRIMARY KEY,
  locker_id TEXT NOT NULL REFERENCES lockers(id),
  user_id TEXT REFERENCES users(id),
  accessed_at INTEGER NOT NULL DEFAULT (unixepoch()),
  access_type TEXT NOT NULL CHECK(access_type IN ("otp", "subscription")),
  otp TEXT,
  status TEXT NOT NULL CHECK(status IN ("success", "failed"))
);

CREATE INDEX IF NOT EXISTS access_locker_id_idx ON access_history(locker_id);
CREATE INDEX IF NOT EXISTS access_user_id_idx ON access_history(user_id);
CREATE INDEX IF NOT EXISTS accessed_at_idx ON access_history(accessed_at); 