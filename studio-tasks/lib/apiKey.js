const { callStudioApi, callBackoffice } = require("./callStudioApi")

// Same values as lib/dao/users/platformRole.js of studio-api
const PLATFORM_ROLE = { USER: 1, SYSTEM_ADMINISTRATOR: 8 }

const KEY_NAME = "studio-tasks"
const KEY_ROLE = PLATFORM_ROLE.USER + PLATFORM_ROLE.SYSTEM_ADMINISTRATOR
const KEY_VALIDITY = "1y"
const PAGE_SIZE = 100

// The key is told from the others by its metadata: its name can be given to
// any key in the backoffice
async function findServiceKey(apiUrl, token) {
  let page = 0
  let seen = 0
  let keys
  do {
    keys = await callBackoffice(apiUrl, "/tokens", {
      token,
      query: { page, size: PAGE_SIZE },
    })
    const key = keys.list.find((item) => item.metadata?.service === KEY_NAME)
    if (key) return key

    seen += keys.list.length
    page += 1
  } while (keys.list.length > 0 && seen < keys.count)
}

// Gives back the API key of the service, kept by studio-api: created at the
// first run, renewed once expired
async function readServiceKey(apiUrl, token) {
  const key = await findServiceKey(apiUrl, token)

  let answer
  if (!key) {
    answer = await callBackoffice(apiUrl, "/tokens", {
      method: "POST",
      token,
      body: {
        name: KEY_NAME,
        role: KEY_ROLE,
        expires_in: KEY_VALIDITY,
        // The route reads the metadata as a JSON string
        metadata: JSON.stringify({ service: KEY_NAME }),
      },
    })
  } else if (key.expired) {
    answer = await callBackoffice(apiUrl, `/tokens/${key.userId}`, {
      method: "PUT",
      token,
      body: { expires_in: KEY_VALIDITY },
    })
  } else {
    answer = await callBackoffice(apiUrl, `/tokens/${key.userId}`, { token })
  }
  return answer.auth_token
}

async function fetchApiKey(apiUrl, email, password) {
  const session = await callStudioApi(apiUrl, "/auth/login", {
    method: "POST",
    body: { email, password },
  })
  const token = session.auth_token

  try {
    return await readServiceKey(apiUrl, token)
  } finally {
    // The session is of no use once the key is read
    await callStudioApi(apiUrl, "/auth/logout", { token }).catch(() => {})
  }
}

// The API key given in the environment comes first: with one, the super
// administrator account is never used.
async function resolveApiKey({ apiUrl, apiKey, email, password }) {
  if (apiKey) return apiKey
  if (email && password) return await fetchApiKey(apiUrl, email, password)
  if (email || password) {
    throw new Error("SUPER_ADMIN_EMAIL and SUPER_ADMIN_PWD go together")
  }
  return null
}

module.exports = { resolveApiKey }
