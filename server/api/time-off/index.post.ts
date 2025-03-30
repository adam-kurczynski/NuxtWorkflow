import { SQL } from 'drizzle-orm'
import { SQLitePreparedQuery } from 'drizzle-orm/sqlite-core'
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  if (!user) {
    throw new Error('Unauthorized')
  }

  
  const { userId, startTime, endTime }: { userId: string, startTime: string, endTime: string} = await readBody(event)

  const params = {
    userId: parseInt(userId),
    startTime: new Date(startTime),
    endTime: new Date(endTime),
  }

  params.endTime.setHours(23, 59, 59, 999)
  params.startTime.setHours(0, 0, 0, 0)

  const filters: SQL[] = []
  if (params.userId) {
    filters.push(eq(tables.timeOff.userId, params.userId))
  }
  if (params.startTime && params.endTime) {
    filters.push(
      or(
      between(tables.timeOff.startTime, params.startTime, params.endTime),
      between(tables.timeOff.endTime, params.startTime, params.endTime)
    ))
  }


  const collision = await useDrizzle().select().from(tables.timeOff)
    .where(and(...filters))
    .get()
  if (collision) {
    throw  createError({
        statusCode: 400,
        statusMessage: 'Masz juz urlop w tym czasie',
    })
  }

  const timeOff = await useDrizzle().insert(tables.timeOff).values({
    userId: params.userId,
    startTime: params.startTime,
    endTime: params.endTime,
    createdTime: new Date()
  }).returning().get()
  return timeOff
})
