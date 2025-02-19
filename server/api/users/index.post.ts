import { genSaltSync, hashSync } from "bcrypt-ts"

export default eventHandler(async (event) => {
  const { username, password, name, email, avatar, role = "user" } = await readBody(event)

  const salt = genSaltSync(10)
  const hash = hashSync(password, salt)

  const user = await useDrizzle().insert(tables.users).values({
    name: name,
    email: email,
    password: hash,
    avatar: avatar,
    createdAt: new Date(),
    username: username,
    role: role,
  }).returning().get()

  return user
})
