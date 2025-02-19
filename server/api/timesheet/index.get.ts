
export default eventHandler(async (event) => {
  const {projectId, userId, startTime, endTime}: {projectId: string, userId: string, startTime: string, endTime: string} = getQuery(event)
  if (!startTime || !endTime) {
    throw new Error('Please provide a start and end time')
  }

  const startDateTime = new Date(startTime)
  const endDateTime = new Date(endTime)

  if (!projectId && userId) {
    const timesheets = await useDrizzle()
    .select()
    .from(tables.userTimelog)
    .leftJoin(tables.projects, eq(tables.userTimelog.projectId, tables.projects.id))
    .leftJoin(tables.users, eq(tables.userTimelog.userId, tables.users.id))
    .where(and
      (
        eq(tables.userTimelog.userId, parseInt(userId)),
        between(tables.userTimelog.startTime, startDateTime, endDateTime)
      ))
    .all()
    return timesheets
  }

  if(projectId && !userId) {
    const timesheets = await useDrizzle()
    .select()
    .from(tables.userTimelog)
    .leftJoin(tables.projects, eq(tables.userTimelog.projectId, tables.projects.id))
    .leftJoin(tables.users, eq(tables.userTimelog.userId, tables.users.id))
    .where(and
      (
        eq(tables.userTimelog.projectId, parseInt(projectId)),
        between(tables.userTimelog.startTime, startDateTime, endDateTime)
      ))
    .all()
    return timesheets
  }

  if(projectId && userId) {
    const timesheets = await useDrizzle()
    .select()
    .from(tables.userTimelog)
    .leftJoin(tables.projects, eq(tables.userTimelog.projectId, tables.projects.id))
    .leftJoin(tables.users, eq(tables.userTimelog.userId, tables.users.id))
    .where(and
      (
        eq(tables.userTimelog.projectId, parseInt(projectId)),
        eq(tables.userTimelog.userId, parseInt(userId)),
        between(tables.userTimelog.startTime, startDateTime, endDateTime)
      ))
    .all()
    return timesheets
  }

  if(!projectId && !userId) {
    const timesheets = await useDrizzle()
    .select()
    .from(tables.userTimelog)
    .leftJoin(tables.projects, eq(tables.userTimelog.projectId, tables.projects.id))
    .leftJoin(tables.users, eq(tables.userTimelog.userId, tables.users.id))
    .where(between(tables.userTimelog.startTime, startDateTime, endDateTime))
    .all()
    return timesheets



}
})