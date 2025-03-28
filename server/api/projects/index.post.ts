export default eventHandler(async (event) => {
  
  const { user } = await requireUserSession(event)
  if (!user) {
    throw new Error('Unauthorized')
  }
  
  const { name, description, clientId, status } = await readBody(event)

  const project = await useDrizzle().insert(tables.projects).values({
    name: name,
    description: description,
    clientId: clientId,
    createdAt: new Date(),
    status: status,
  }).returning().get()

  return project
})