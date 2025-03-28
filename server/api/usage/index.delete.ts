export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  if (!user) {
    throw new Error('Unauthorized')
  }
  
  const { id }: {id: string} = getQuery(event)
  const idParam = parseInt(id)

  const assetUsage = await useDrizzle().delete(tables.assetUsage).where(eq(tables.assetUsage.id, idParam)).returning().get()
})
