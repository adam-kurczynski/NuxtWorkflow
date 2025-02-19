export default eventHandler(async () => {
  const projects = await useDrizzle()
  .select()
  .from(tables.projects)
  .leftJoin(tables.clients, eq(tables.projects.clientId, tables.clients.id))
  .all()
  return projects
})