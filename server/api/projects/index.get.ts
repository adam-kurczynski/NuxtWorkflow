export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  if (!user) {
    throw new Error('Unauthorized')
  }
  const { search, id }: {search: string, id: string} = getQuery(event)

  const idParsed = parseInt(id)

  if (idParsed) {
    const project = await useDrizzle() 
    .select()
    .from(tables.projects)
    .leftJoin(tables.clients, eq(tables.projects.clientId, tables.clients.id))
    .where(eq(tables.projects.id, idParsed))
    .get()
    return project
  }
  if (search) {
    const projects = await useDrizzle()
    .select()
    .from(tables.projects)
    .leftJoin(tables.clients, eq(tables.projects.clientId, tables.clients.id))
    .where(like(tables.projects.name, (`%${search}%`)))
    .all()
    return projects
  }
  const projects = await useDrizzle()
  .select()
  .from(tables.projects)
  .leftJoin(tables.clients, eq(tables.projects.clientId, tables.clients.id))
  .all()
  return projects
})