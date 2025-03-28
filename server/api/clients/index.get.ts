export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  if (!user) {
    throw new Error('Unauthorized')
  }
  const { search }: {search: string} = getQuery(event)
  console.log('search', search)
  if (search) {
    const clients = await useDrizzle()
    .select().from(tables.clients)
    .where(like(tables.clients.name, (`%${search}%`)))
    .all()
    return clients
  }
  const clients = await useDrizzle().select().from(tables.clients).all()
  return clients
})