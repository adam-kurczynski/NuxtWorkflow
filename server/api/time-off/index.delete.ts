export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  if (!user) {
    throw new Error('Unauthorized')
  }
  const { id }: {id: string} = getQuery(event)
  const idParam = parseInt(id)

  const timeOff = await useDrizzle().delete(tables.timeOff).where(eq(tables.timeOff.id, idParam)).returning().get()
  return timeOff
})
