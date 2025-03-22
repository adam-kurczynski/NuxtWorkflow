
export default eventHandler(async (event) => {
  const {projectId, userId, startTime, endTime}: {projectId: string, userId: string, startTime: string, endTime: string} = getQuery(event)
  console.log(projectId, userId, startTime, endTime)
  if (!startTime || !endTime) {
    throw new Error('Please provide a start and end time')
  }
  
  const startDateTime = new Date(startTime)
  const endDateTime = new Date(endTime)
  const userIdParam = parseInt(userId)
  const projectIdParam = parseInt(projectId)

  if (!projectIdParam && userIdParam) {
    console.log('userIdParam')
    const timesheets = await useDrizzle()
    .select()
    .from(tables.userTimelog)
    .leftJoin(tables.projects, eq(tables.userTimelog.projectId, tables.projects.id))
    .leftJoin(tables.users, eq(tables.userTimelog.userId, tables.users.id))
    .where(and
      (
        eq(tables.userTimelog.userId, userIdParam),
        between(tables.userTimelog.startTime, startDateTime, endDateTime)
      ))
    .all()
    return timesheets
  }

  if(projectIdParam && !userIdParam) {
    console.log('projectId', projectIdParam)
    const timesheets = await useDrizzle()
    .select()
    .from(tables.userTimelog)
    .leftJoin(tables.projects, eq(tables.userTimelog.projectId, tables.projects.id))
    .leftJoin(tables.users, eq(tables.userTimelog.userId, tables.users.id))
    .where(and
      (
        eq(tables.userTimelog.projectId, projectIdParam),
        between(tables.userTimelog.startTime, startDateTime, endDateTime)
      ))
    .all()
    return timesheets
  }

  if(projectIdParam && userId) {
    console.log('both')
    const timesheets = await useDrizzle()
    .select()
    .from(tables.userTimelog)
    .leftJoin(tables.projects, eq(tables.userTimelog.projectId, tables.projects.id))
    .leftJoin(tables.users, eq(tables.userTimelog.userId, tables.users.id))
    .where(and
      (
        eq(tables.userTimelog.projectId, projectIdParam),
        eq(tables.userTimelog.userId, userIdParam),
        between(tables.userTimelog.startTime, startDateTime, endDateTime)
      ))
    .all()
    return timesheets
  }

  if(!projectIdParam && !userIdParam) {
    console.log('no project id and no user id')
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