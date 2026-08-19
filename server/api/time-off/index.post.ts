import { and, eq, lte, gte } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  if (!user) {
    throw new Error("Unauthorized");
  }

  const {
    userId,
    startTime,
    endTime,
  }: { userId: string | number; startTime: string | Date; endTime: string | Date } = await readBody(
    event
  );

  let startDate = new Date(startTime);
  let endDate = new Date(endTime);

  if (typeof startTime === "string" && /^\d{4}-\d{2}-\d{2}$/.test(startTime)) {
    startDate = new Date(`${startTime}T00:00:00`);
  }
  if (typeof endTime === "string" && /^\d{4}-\d{2}-\d{2}$/.test(endTime)) {
    endDate = new Date(`${endTime}T23:59:59.999`);
  }

  const params = {
    userId: typeof userId === "number" ? userId : parseInt(userId),
    startTime: startDate,
    endTime: endDate,
  };

  const collision = await useDrizzle()
    .select()
    .from(tables.timeOff)
    .where(
      and(
        eq(tables.timeOff.userId, params.userId),
        lte(tables.timeOff.startTime, params.endTime),
        gte(tables.timeOff.endTime, params.startTime)
      )
    )
    .get();

  if (collision) {
    throw createError({
      statusCode: 400,
      statusMessage: "Masz juz urlop w tym czasie",
    });
  }

  const timeOff = await useDrizzle()
    .insert(tables.timeOff)
    .values({
      userId: params.userId,
      startTime: params.startTime,
      endTime: params.endTime,
      createdTime: new Date(),
    })
    .returning()
    .get();
  return timeOff;
});
