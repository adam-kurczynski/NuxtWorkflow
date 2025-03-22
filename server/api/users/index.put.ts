import { genSaltSync, hashSync, compareSync } from "bcrypt-ts"
export default eventHandler(async (event) => {
// Compare old password and update it
  const { oldPassword, newPassword, id }: { oldPassword: string, newPassword: string, id: number } = await readBody(event)
  const user = await useDrizzle().select().from(tables.users).where(eq(tables.users.id, id)).get()
  if (!user) {
    throw new Error("User not found")
  }
  if (!compareSync(oldPassword, user.password)) {
    throw new Error("Old password is incorrect")
  }
  const salt = genSaltSync(10)
  const hash = hashSync(newPassword, salt)
  const updatedUser = await useDrizzle().update(tables.users).set({
    password: hash,
  }).where(eq(tables.users.id, id)).returning().get()
  return updatedUser
})
