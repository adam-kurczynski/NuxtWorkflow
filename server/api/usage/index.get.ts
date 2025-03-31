import { SQL, desc, sum } from 'drizzle-orm'
export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  if (!user) {
    throw new Error('Unauthorized')
  }
  
  const { projectId, assetId, startDate, endDate, isGrouped }: { projectId: string, assetId: string, startDate: string, endDate: string, isGrouped: string } = getQuery(event)
  
  const projectIdParam = parseInt(projectId)
  const assetIdParam = parseInt(assetId)
  const startDateParam = new Date(startDate)
  const endDateParam = new Date(endDate)
  const isgroupedParam = isGrouped === 'true'
  endDateParam.setDate(endDateParam.getDate() + 1)
  const filters: SQL[] = []
  
  if (projectIdParam) {
    filters.push(eq(tables.assetUsage.projectId, projectIdParam))  
  }
  if (assetIdParam){
  filters.push(eq(tables.assetUsage.assetId, assetIdParam))
  }
  if (startDate  && endDate ) {
  filters.push(between(tables.assetUsage.createdAt, startDateParam, endDateParam))
}

  if(isgroupedParam) {
    const assetUsage = await useDrizzle().select({
      assetId: tables.assetUsage.assetId,
      quantity: sum(tables.assetUsage.quantity),
      assetName: tables.assets.name,
      unit: tables.assets.unit,
    }).from(tables.assetUsage)
    .leftJoin(tables.assets, eq(tables.assetUsage.assetId, tables.assets.id))
    .leftJoin(tables.projects, eq(tables.assetUsage.projectId, tables.projects.id))
    .leftJoin(tables.users, eq(tables.assetUsage.addedBy, tables.users.id))
    .where(and(...filters))
    .groupBy(tables.assetUsage.assetId,
      tables.assets.name,
      tables.assets.unit,
    )
    .all()
    return assetUsage
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