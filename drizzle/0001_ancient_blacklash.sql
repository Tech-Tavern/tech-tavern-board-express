CREATE TABLE `board_users` (
	`board_id` bigint unsigned NOT NULL,
	`user_uid` varchar(64) NOT NULL,
	`role` varchar(20) DEFAULT 'member',
	`invited_at` timestamp DEFAULT (now()),
	CONSTRAINT `board_users_board_id_user_uid_pk` PRIMARY KEY(`board_id`,`user_uid`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`uid` varchar(64) NOT NULL,
	`email` varchar(255) NOT NULL,
	`name` varchar(255),
	`photo` varchar(512),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `users_uid` PRIMARY KEY(`uid`)
);
--> statement-breakpoint
ALTER TABLE `boards` ADD `owner_uid` varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE `boards` ADD `created_by` varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE `boards` ADD `updated_by` varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE `cards` ADD `created_by` varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE `cards` ADD `updated_by` varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE `lists` ADD `created_by` varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE `lists` ADD `updated_by` varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE `board_users` ADD CONSTRAINT `board_users_board_id_boards_id_fk` FOREIGN KEY (`board_id`) REFERENCES `boards`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `board_users` ADD CONSTRAINT `board_users_user_uid_users_uid_fk` FOREIGN KEY (`user_uid`) REFERENCES `users`(`uid`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `boards` ADD CONSTRAINT `boards_owner_uid_users_uid_fk` FOREIGN KEY (`owner_uid`) REFERENCES `users`(`uid`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `boards` ADD CONSTRAINT `boards_created_by_users_uid_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`uid`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `boards` ADD CONSTRAINT `boards_updated_by_users_uid_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`uid`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cards` ADD CONSTRAINT `cards_created_by_users_uid_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`uid`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cards` ADD CONSTRAINT `cards_updated_by_users_uid_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`uid`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lists` ADD CONSTRAINT `lists_created_by_users_uid_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`uid`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lists` ADD CONSTRAINT `lists_updated_by_users_uid_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`uid`) ON DELETE no action ON UPDATE no action;