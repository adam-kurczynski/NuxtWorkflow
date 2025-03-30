import { drizzle } from 'drizzle-orm/d1'
export { sql, eq, and, or, between, like, lt, gt, SQL } from 'drizzle-orm'

import * as schema from '../database/schema'

export const tables = schema

export function useDrizzle() {
  return drizzle(hubDatabase(), { schema })
}

export type User = typeof schema.users.$inferSelect
export type Client = typeof schema.clients.$inferSelect
export type Project = typeof schema.projects.$inferSelect
export type Asset = typeof schema.assets.$inferSelect
export type AssetUsage = typeof schema.assetUsage.$inferSelect
export type UserTimelog = typeof schema.userTimelog.$inferSelect
export type TimeOff = typeof schema.timeOff.$inferSelect
