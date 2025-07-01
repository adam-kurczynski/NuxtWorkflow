export default eventHandler(async (event) => {
    const { user } = await requireUserSession(event)
    if (!user) {
      throw new Error('Unauthorized')
    }

    const config = await useDrizzle()
    .select()
    .from(tables.config)
    .get()

    if (config) {
        return config.isRestrictionDisabled === 1
    }

    const newConfig = await useDrizzle().insert(tables.config).values({
        id: 1,
        isRestrictionDisabled: 0
    }).returning().get()

    return false
})