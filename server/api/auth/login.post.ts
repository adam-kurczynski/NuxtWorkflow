import { compareSync } from "bcrypt-ts"

export default defineEventHandler(async (event) => {

  const body = await readBody(event)
  const { username, password } = body

  const [user] = await useDrizzle().select().from(tables.users).where(eq(tables.users.username, username))
  if (!user) {
    throw new Error('User not found')
  }

  if (!compareSync(password, user.password)) {
    throw new Error('Invalid password')
  }

  const userData = {username: username, role: user.role, name: user.name, email: user.email, avatar: user.avatar, id: user.id}
  return "Hello, World!"
  try {
    await setUserSession(event, {
      user: userData,
      loggedInAt: new Date(),
    })
  } catch (error) {
    throw new Error(`Failed to set user session: ${error.message}`)
  }
})
