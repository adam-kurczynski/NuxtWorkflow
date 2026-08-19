CREATE TABLE `time_off` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`start_time` integer NOT NULL,
	`end_time` integer NOT NULL,
	`created_time` integer NOT NULL
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user_timelog` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`project_id` integer NOT NULL,
	`start_time` integer NOT NULL,
	`end_time` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_user_timelog`("id", "user_id", "project_id", "start_time", "end_time", "created_at") SELECT "id", "user_id", "project_id", "start_time", "end_time", "created_at" FROM `user_timelog`;--> statement-breakpoint
DROP TABLE `user_timelog`;--> statement-breakpoint
ALTER TABLE `__new_user_timelog` RENAME TO `user_timelog`;--> statement-breakpoint
PRAGMA foreign_keys=ON;