import { desc, eq, and, lte, gte, type SQL } from "drizzle-orm";

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  if (!user) {
    throw new Error("Unauthorized");
  }
  const query = getQuery(event);
  const userIdParam = query.userId ? parseInt(query.userId as string) : undefined;

  const filters: SQL[] = [];
  if (userIdParam && userIdParam !== 0) {
    filters.push(eq(tables.timeOff.userId, userIdParam));
  }
  if (query.startTime && query.endTime) {
    const start = new Date(query.startTime as string);
    const end = new Date(query.endTime as string);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      filters.push(
        and(
          lte(tables.timeOff.startTime, end),
          gte(tables.timeOff.endTime, start)
        )!
      );
    }
  }

  const timeOff = await useDrizzle()
    .select()
    .from(tables.timeOff)
    .leftJoin(tables.users, eq(tables.timeOff.userId, tables.users.id))
    .where(filters.length > 0 ? and(...filters) : undefined)
    .orderBy(desc(tables.timeOff.createdTime))
    .all();

  return timeOff;
});
