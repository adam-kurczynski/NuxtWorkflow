export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  if (!user) {
    throw new Error('Unauthorized')
  }
  const { name, unit, id }: { name: string, unit: string, id: number } = await readBody(event)
  const asset = await useDrizzle().update(tables.assets).set({
    name: name,
    unit: unit,
  }).where(eq(tables.assets.id, id)).returning().get()


})
