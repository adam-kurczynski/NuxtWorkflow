export default eventHandler(async (event) => {
  
    const { user } = await requireUserSession(event)
    if (!user) {
      throw new Error('Unauthorized')
    }
    
    const { name, description, clientId, status, id, notes } = await readBody(event)
    console.log(notes)

    const project = await useDrizzle().update(tables.projects).set({
        name: name,
        description: description,
        clientId: clientId,
        notes: notes,
    }).where(eq(tables.projects.id, id)).returning().get()
    return project
  })