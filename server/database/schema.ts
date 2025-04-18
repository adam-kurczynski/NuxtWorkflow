import { desc } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  avatar: text("avatar").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  username: text("username").notNull().unique(),
  role: text("role").notNull(),
});

export const clients = sqliteTable("clients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  address: text("address").notNull(),
  phone: text("phone"),
});

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  clientId: integer("client_id"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  status: text("status").notNull(),
});

export const assets = sqliteTable("assets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  unit: text("unit").notNull(),
});

export const assetUsage = sqliteTable("asset_usage", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  assetId: integer("asset_id").notNull(),
  projectId: integer("project_id").notNull(),
  quantity: integer("quantity").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  addedBy: integer("user_id").notNull(),
});

export const userTimelog = sqliteTable("user_timelog", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  projectId: integer("project_id").notNull(),
  startTime: integer("start_time", { mode: "timestamp" }).notNull(),
  endTime: integer("end_time", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const timeOff = sqliteTable("time_off", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  startTime: integer("start_time", { mode: "timestamp" }).notNull(),
  endTime: integer("end_time", { mode: "timestamp" }).notNull(),
  createdTime: integer("created_time", { mode: "timestamp" }).notNull(),
});
