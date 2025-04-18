PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`client_id` integer,
	`created_at` integer NOT NULL,
	`status` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_projects`("id", "name", "description", "client_id", "created_at", "status") SELECT "id", "name", "description", "client_id", "created_at", "status" FROM `projects`;--> statement-breakpoint
DROP TABLE `projects`;--> statement-breakpoint
ALTER TABLE `__new_projects` RENAME TO `projects`;--> statement-breakpoint
PRAGMA foreign_keys=ON;