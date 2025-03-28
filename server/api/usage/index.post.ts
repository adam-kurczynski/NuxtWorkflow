export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  if (!user) {
    throw new Error('Unauthorized')
  }
  
  const { assetId, projectId, quantity, addedBy } = await readBody(event)
  const usage = await useDrizzle().insert(tables.assetUsage).values({
    assetId: assetId,
    projectId: projectId,
    quantity: quantity,
    createdAt: new Date(),
    addedBy: addedBy,
  }).returning().get()

  return usage
})