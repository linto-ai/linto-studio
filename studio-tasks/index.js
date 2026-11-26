const { deleteExpiredMedia } = require("./tasks/deleteExpiredMedia")
const { resolveApiKey } = require("./lib/apiKey")

async function main() {
  const apiUrl = process.env.STUDIO_API_URL
  if (!apiUrl) throw new Error("STUDIO_API_URL is required")
  const apiKey = await resolveApiKey({
    apiUrl,
    apiKey: process.env.STUDIO_API_KEY,
    email: process.env.SUPER_ADMIN_EMAIL,
    password: process.env.SUPER_ADMIN_PWD,
  })
  // Not a failure
  if (!apiKey) {
    console.warn(
      "Nothing done: no STUDIO_API_KEY, nor SUPER_ADMIN_EMAIL and SUPER_ADMIN_PWD",
    )
    return
  }

  const { deleted, failed } = await deleteExpiredMedia({ apiUrl, apiKey })
  console.log(`Expired media: ${deleted} deleted, ${failed} not deleted`)
}

// A failed run ends with a non-zero code, for the CronJob to report it
main().catch((err) => {
  let reason = err.message
  // fetch only says "fetch failed", the network error is in the cause
  if (err.cause?.code) reason += ` (${err.cause.code})`
  console.error(`studio-tasks failed: ${reason}`)
  process.exitCode = 1
})
