export default eventHandler(async (event) => {
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