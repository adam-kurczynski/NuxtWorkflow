import { SQL, desc } from 'drizzle-orm'
export default eventHandler(async (event) => {
  const { projectId, assetId, startDate, endDate }: { projectId: string, assetId: string, startDate: string, endDate: string } = getQuery(event)

  const projectIdParam = parseInt(projectId)
  const assetIdParam = parseInt(assetId)
  const startDateParam = new Date(startDate)
  const endDateParam = new Date(endDate)
  endDateParam.setDate(endDateParam.getDate() + 1)
  const filters: SQL[] = []
  console.log(projectIdParam, assetIdParam, startDateParam, endDateParam)
  if (projectIdParam) {
    filters.push(eq(tables.assetUsage.projectId, projectIdParam))  
  }
  if (assetIdParam){
  filters.push(eq(tables.assetUsage.assetId, assetIdParam))
  }
  if (startDateParam && endDateParam){
  filters.push(between(tables.assetUsage.createdAt, startDateParam, endDateParam))
}
  //select asset usage with filters and join with assets, projects and users
  const assetUsage = await useDrizzle().select().from(tables.assetUsage)
  .leftJoin(tables.assets, eq(tables.assetUsage.assetId, tables.assets.id))
  .leftJoin(tables.projects, eq(tables.assetUsage.projectId, tables.projects.id))
  .leftJoin(tables.users, eq(tables.assetUsage.addedBy, tables.users.id))
  .where(and(...filters))
  .orderBy(desc(tables.assetUsage.createdAt))
  .all()
  return assetUsage
})