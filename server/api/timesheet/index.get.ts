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

  const startDateTime = new Date(startTime);
  const endDateTime = new Date(endTime);
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
      .orderBy(desc(tables.userTimelog.createdAt))
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
      .orderBy(desc(tables.userTimelog.createdAt))
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
      .orderBy(desc(tables.userTimelog.createdAt))
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
      .orderBy(desc(tables.userTimelog.createdAt))
      .limit(limitParam);
    return timesheets;
  }
});
