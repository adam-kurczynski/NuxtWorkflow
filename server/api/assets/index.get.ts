export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  if (!user) {
    throw new Error('Unauthorized')
  }
  const { name }: { name: string } = getQuery(event)



  if (!name) {
    const assets = await useDrizzle().select().from(tables.assets).all()
    return assets
  }
  try {
    const assets = await useDrizzle().select().from(tables.assets).where(like(tables.assets.name, `%${name}%`)).all()
    return assets
  } catch (error) {

  }

})