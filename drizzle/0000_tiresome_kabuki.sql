CREATE TABLE `access_history` (
	`id` text PRIMARY KEY NOT NULL,
	`locker_id` text NOT NULL,
	`user_id` text,
	`accessed_at` integer DEFAULT unixepoch() NOT NULL,
	`access_type` text(15) NOT NULL,
	`otp` text,
	`status` text(10) NOT NULL,
	FOREIGN KEY (`locker_id`) REFERENCES `lockers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `locker_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`locker_id` text NOT NULL,
	`subscription_type_id` text NOT NULL,
	`status` text(10) DEFAULT 'pending' NOT NULL,
	`proof_of_payment` text(4294967295),
	`rejection_reason` text,
	`requested_at` integer DEFAULT unixepoch() NOT NULL,
	`processed_at` integer,
	`processed_by` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`locker_id`) REFERENCES `lockers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`subscription_type_id`) REFERENCES `subscription_types`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`processed_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `lockers` (
	`id` text PRIMARY KEY NOT NULL,
	`number` text NOT NULL,
	`size` text(10) NOT NULL,
	`is_occupied` integer DEFAULT 0 NOT NULL,
	`user_id` text,
	`otp` text,
	`created_at` integer DEFAULT unixepoch() NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `subscription_types` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`duration` text(10) NOT NULL,
	`size` text(10) DEFAULT 'small' NOT NULL,
	`amount` integer NOT NULL,
	`is_active` integer DEFAULT 1 NOT NULL,
	`created_at` integer DEFAULT unixepoch() NOT NULL
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`status` text(10) NOT NULL,
	`user_id` text NOT NULL,
	`locker_id` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` integer DEFAULT unixepoch() NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`locker_id`) REFERENCES `lockers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`amount` text NOT NULL,
	`user_id` text NOT NULL,
	`subscription_id` text,
	`status` text(10) NOT NULL,
	`proof_of_payment` text,
	`created_at` integer DEFAULT unixepoch() NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`type` text(10) DEFAULT 'user' NOT NULL,
	`created_at` integer DEFAULT unixepoch() NOT NULL,
	`updated_at` integer DEFAULT unixepoch() NOT NULL
);
--> statement-breakpoint
CREATE INDEX `access_locker_id_idx` ON `access_history` (`locker_id`);--> statement-breakpoint
CREATE INDEX `access_user_id_idx` ON `access_history` (`user_id`);--> statement-breakpoint
CREATE INDEX `accessed_at_idx` ON `access_history` (`accessed_at`);--> statement-breakpoint
CREATE INDEX `request_user_id_idx` ON `locker_requests` (`user_id`);--> statement-breakpoint
CREATE INDEX `request_locker_id_idx` ON `locker_requests` (`locker_id`);--> statement-breakpoint
CREATE INDEX `request_status_idx` ON `locker_requests` (`status`);--> statement-breakpoint
CREATE INDEX `subscription_type_idx` ON `locker_requests` (`subscription_type_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `lockers_number_unique` ON `lockers` (`number`);--> statement-breakpoint
CREATE INDEX `number_idx` ON `lockers` (`number`);--> statement-breakpoint
CREATE INDEX `locker_user_id_idx` ON `lockers` (`user_id`);--> statement-breakpoint
CREATE INDEX `size_idx` ON `lockers` (`size`);--> statement-breakpoint
CREATE INDEX `duration_idx` ON `subscription_types` (`duration`);--> statement-breakpoint
CREATE INDEX `size_idx` ON `subscription_types` (`size`);--> statement-breakpoint
CREATE INDEX `sub_user_id_idx` ON `subscriptions` (`user_id`);--> statement-breakpoint
CREATE INDEX `locker_id_idx` ON `subscriptions` (`locker_id`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `subscriptions` (`status`);--> statement-breakpoint
CREATE INDEX `trans_user_id_idx` ON `transactions` (`user_id`);--> statement-breakpoint
CREATE INDEX `subscription_id_idx` ON `transactions` (`subscription_id`);--> statement-breakpoint
CREATE INDEX `trans_status_idx` ON `transactions` (`status`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `type_idx` ON `users` (`type`);