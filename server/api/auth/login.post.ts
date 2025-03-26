import { compareSync } from "bcrypt-ts"
import { z } from "zod"

const bodySchema = z.object({
  username: z.string(),
  password: z.string(),
})

export default eventHandler(async (event) => {

  const body = await readValidatedBody(event, bodySchema.parse)
  const { username, password } = body

  const [user] = await useDrizzle().select().from(tables.users).where(eq(tables.users.username, username))
  if (!user) {
    throw new Error('User not found')
  }

  if (!compareSync(password, user.password)) {
    console.log('invalid password')
    throw new Error('Invalid password')
  }

  const userData = {username: username, role: user.role, name: user.name, email: user.email, avatar: user.avatar, id: user.id}

  try {
    await replaceUserSession(event, {
      user: userData,
      loggedInAt: new Date(),

    })
  } catch (error) {
    console.log('error', error)
  }
    return "Hello, World!"
})
