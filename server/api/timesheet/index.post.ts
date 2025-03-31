import {gte, lte} from 'drizzle-orm'
import { timeOff } from '~~/server/database/schema'
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
  //check if timesheet doesn't collide with time off
  const timeOffs = await useDrizzle()
  .select()
  .from(tables.timeOff)
  .where(and(
    eq(tables.timeOff.userId, userId),
    lte(tables.timeOff.startTime, new Date(startTime)),
    gte(tables.timeOff.endTime, new Date(endTime))
  )).all()
  if (timeOffs.length > 0) {
    throw  createError({
        statusCode: 400,
        statusMessage: 'Godziny koliduja z urlopem',
    })
  }
  
  //check if timesheet in not before two weeks
  const now = new Date()
  const twoWeeksAgo = new Date()
  twoWeeksAgo.setDate(now.getDate() - 14)
  if (new Date(startTime) < twoWeeksAgo) {
    throw  createError({
        statusCode: 400,
        statusMessage: 'Nie mozna dodac wpisu starszego niz 14 dni',
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