import { SQL, lte, gte } from 'drizzle-orm'
export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  if (!user) {
    throw new Error('Unauthorized')
  }
  const { userId, startTime, endTime }: { userId: string, startTime: string, endTime: string} = getQuery(event)
  const params = {
    userId: parseInt(userId),
    startTime: new Date(startTime),
    endTime: new Date(endTime),
  }
  const timeOff = await useDrizzle().select().from(tables.timeOff)
  .leftJoin(tables.users, eq(tables.timeOff.userId, tables.users.id))
  .all()
  return timeOff
})
