export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  if (!user) {
    throw new Error("Unauthorized");
  }

  interface QueryParams {
    projectId: string;
    userId: string;
    startTime: string;
    endTime: string;
    limit: string;
  }

  const { projectId, userId, startTime, endTime, limit } = getQuery(
    event
  ) as QueryParams;

  if (!startTime || !endTime) {
    throw new Error("Please provide a start and end time");
  }

  let startDateTime = new Date(startTime);
  let endDateTime = new Date(endTime);

  if (typeof startTime === "string" && /^\d{4}-\d{2}-\d{2}$/.test(startTime)) {
    startDateTime = new Date(`${startTime}T00:00:00`);
  }
  if (typeof endTime === "string" && /^\d{4}-\d{2}-\d{2}$/.test(endTime)) {
    endDateTime = new Date(`${endTime}T23:59:59.999`);
  }

  const userIdParam = parseInt(userId);
  const projectIdParam = parseInt(projectId);
  const limitParam = parseInt(limit) || 10000;

  if (!projectIdParam && userIdParam) {
    const timesheets = await useDrizzle()
      .select()
      .from(tables.userTimelog)
      .leftJoin(
        tables.projects,
        eq(tables.userTimelog.projectId, tables.projects.id)
      )
      .leftJoin(tables.users, eq(tables.userTimelog.userId, tables.users.id))
      .where(
        and(
          eq(tables.userTimelog.userId, userIdParam),
          between(tables.userTimelog.startTime, startDateTime, endDateTime)
        )
      )
      .orderBy(desc(tables.userTimelog.endTime))
      .limit(limitParam);
    return timesheets;
  }

  if (projectIdParam && !userIdParam) {
    const timesheets = await useDrizzle()
      .select()
      .from(tables.userTimelog)
      .leftJoin(
        tables.projects,
        eq(tables.userTimelog.projectId, tables.projects.id)
      )
      .leftJoin(tables.users, eq(tables.userTimelog.userId, tables.users.id))
      .where(
        and(
          eq(tables.userTimelog.projectId, projectIdParam),
          between(tables.userTimelog.startTime, startDateTime, endDateTime)
        )
      )
      .orderBy(desc(tables.userTimelog.endTime))
      .limit(limitParam);
    return timesheets;
  }

  if (projectIdParam && userId) {
    const timesheets = await useDrizzle()
      .select()
      .from(tables.userTimelog)
      .leftJoin(
        tables.projects,
        eq(tables.userTimelog.projectId, tables.projects.id)
      )
      .leftJoin(tables.users, eq(tables.userTimelog.userId, tables.users.id))
      .where(
        and(
          eq(tables.userTimelog.projectId, projectIdParam),
          eq(tables.userTimelog.userId, userIdParam),
          between(tables.userTimelog.startTime, startDateTime, endDateTime)
        )
      )
      .orderBy(desc(tables.userTimelog.endTime))
      .limit(limitParam);
    return timesheets;
  }

  if (!projectIdParam && !userIdParam) {
    const timesheets = await useDrizzle()
      .select()
      .from(tables.userTimelog)
      .leftJoin(
        tables.projects,
        eq(tables.userTimelog.projectId, tables.projects.id)
      )
      .leftJoin(tables.users, eq(tables.userTimelog.userId, tables.users.id))
      .where(between(tables.userTimelog.startTime, startDateTime, endDateTime))
      .orderBy(desc(tables.userTimelog.endTime))
      .limit(limitParam);
    return timesheets;
  }
});
