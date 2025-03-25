export default eventHandler(async (event) => {
  const { search }: {search: string} = getQuery(event)
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