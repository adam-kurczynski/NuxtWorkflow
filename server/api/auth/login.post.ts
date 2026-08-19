import { compareSync } from "bcrypt-ts"
import { z } from "zod"

const bodySchema = z.object({
  username: z.string(),
  password: z.string(),
})

export default eventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, bodySchema.parse)
    const { username, password } = body

    console.log(`[AUTH] Attempting login for username: "${username}"`)

    // 1. Fetch user from D1
    const [user] = await useDrizzle()
      .select()
      .from(tables.users)
      .where(eq(tables.users.username, username))

    if (!user) {
      console.warn(`[AUTH] User "${username}" not found in DB`)
      throw createError({
        statusCode: 401,
        statusMessage: "User not found",
      })
    }

    console.log(`[AUTH] User found with ID ${user.id}. Comparing password...`)

    // 2. Validate password
    let passwordMatches = false
    try {
      passwordMatches = compareSync(password, user.password)
    } catch (bcryptErr) {
      console.error("[AUTH] Bcrypt comparison error (possibly invalid hash in DB):", bcryptErr)
      throw createError({
        statusCode: 500,
        statusMessage: "Password hash format invalid in database",
      })
    }

    if (!passwordMatches) {
      console.warn(`[AUTH] Password mismatch for user: "${username}"`)
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid password",
      })
    }

    // 3. Create Session
    const userData = {
      username: user.username,
      role: user.role,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      id: user.id,
    }

    try {
      await replaceUserSession(event, {
        user: userData,
        loggedInAt: new Date(),
      })
      console.log(`[AUTH] Session created successfully for user ID ${user.id}`)
    } catch (sessionErr: any) {
      console.error("[AUTH] Session creation failed:", sessionErr)
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to create session: ${sessionErr?.message || sessionErr}`,
      })
    }

    return { success: true }
  } catch (error: any) {
    console.error("[AUTH] Login error:", error)
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || "Internal Login Error",
    })
  }
})
