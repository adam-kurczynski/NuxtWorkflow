export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  if (!user) {
    throw new Error('Unauthorized')
  }
  
  const { startTime, endTime, projectId, userId } = await readBody(event)
  //check if timesheet doeasn't collide with existing timesheet

  const timesheets = await useDrizzle()
  .select()
  .from(tables.userTimelog)
  .where(and(
    eq(tables.userTimelog.userId, userId),
    or(
      between(tables.userTimelog.startTime, new Date(startTime), new Date(endTime)),
      between(tables.userTimelog.endTime, new Date(startTime), new Date(endTime))
    )
  )).all()


  if (timesheets.length > 0) {
    throw  createError({
        statusCode: 400,
        statusMessage: 'Godziny kolidują z innym wpisem',
    })
  }

  const timesheet = await useDrizzle().insert(tables.userTimelog).values({
    userId: userId,
    projectId: projectId,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    createdAt: new Date(),
  }).returning().get()

  return timesheet
})