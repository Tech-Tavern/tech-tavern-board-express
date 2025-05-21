ALTER TABLE `board_users` MODIFY COLUMN `role` varchar(20) NOT NULL DEFAULT 'member';--> statement-breakpoint
ALTER TABLE `board_users` ADD `status` enum('pending','accepted') DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `board_users` ADD `invited_by` varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE `board_users` ADD CONSTRAINT `board_users_invited_by_users_uid_fk` FOREIGN KEY (`invited_by`) REFERENCES `users`(`uid`) ON DELETE no action ON UPDATE no action;