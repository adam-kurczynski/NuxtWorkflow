import { number } from "yup"

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  if (!user) {
    throw new Error('Unauthorized')
  }
  const { id }: {id: string} = getQuery(event)
  const timesheet = await useDrizzle().delete(tables.userTimelog).where(eq(tables.userTimelog.id, parseInt(id))).returning().get()

})
