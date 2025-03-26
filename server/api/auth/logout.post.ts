export default eventHandler(async (event) => {
  const { user } = await getUserSession(event)
  if (!user) {
    throw new Error('User not found')
  }
  await clearUserSession(event, {
    password: user.password
  })
})