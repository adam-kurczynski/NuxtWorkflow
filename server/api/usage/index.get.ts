export default eventHandler(async (event) => {
  const { projectId, assetId, startDate, endDate }: { projectId: string, assetId: string, startDate: string, endDate: string } = getQuery(event)
})