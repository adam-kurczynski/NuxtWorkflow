export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  if (!user) {
    throw new Error('Unauthorized')
  }

  const {name, description, unit} = await readBody(event)
  const asset = await useDrizzle().insert(tables.assets).values({
    name: name,
    description: description,
    createdAt: new Date(),
    unit: unit,
  }).returning().get()

  return asset
})
