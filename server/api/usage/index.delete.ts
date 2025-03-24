export default eventHandler(async (event) => {
  const { id }: {id: string} = getQuery(event)
  const idParam = parseInt(id)

  const assetUsage = await useDrizzle().delete(tables.assetUsage).where(eq(tables.assetUsage.id, idParam)).returning().get()
})
