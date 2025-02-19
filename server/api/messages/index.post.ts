export default eventHandler(async (event) => {
  const { text } = await readBody(event)
  const db = hubDatabase()

  await useDrizzle().insert(tables.messages).values({
    text,
    createdAt: Date.now()
  }).execute()

  return {}
})
