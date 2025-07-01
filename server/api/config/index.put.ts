export default eventHandler(async (event) => {
    const { user } = await requireUserSession(event)
    if (!user) {
      throw new Error('Unauthorized')
    }

    const { enable }: { enable: boolean} = await readBody(event)
    const config = await useDrizzle().update(tables.config).set({
        isRestrictionDisabled: enable ? 1 : 0
    }).where(eq(tables.config.id, 1)).returning().get()

    return config.isRestrictionDisabled === 1

})