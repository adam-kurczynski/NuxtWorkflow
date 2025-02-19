export default eventHandler(async () => {
  const clients = await useDrizzle().select().from(tables.clients).all()
  return clients
})