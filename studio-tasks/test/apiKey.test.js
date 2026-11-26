const test = require("node:test")
const assert = require("node:assert/strict")

const { resolveApiKey } = require("../lib/apiKey")
const { fakeStudioApi } = require("./fakeStudioApi")

const ACCOUNT = {
  apiUrl: "http://studio-api",
  email: "admin@example.com",
  password: "password",
}
const LOGIN = "POST /auth/login"
const LOGOUT = "GET /auth/logout"
const TOKENS = "/api/administration/tokens"

const SESSION = {
  [LOGIN]: () => ({ status: 202, body: { auth_token: "session" } }),
  [LOGOUT]: () => ({ body: { message: "User has been disconnected" } }),
}

function keyList(...items) {
  return { body: { count: items.length, list: items } }
}

function serviceKey(expired) {
  return {
    userId: "key-1",
    firstname: "studio-tasks",
    metadata: { service: "studio-tasks" },
    expired,
  }
}

function routesOf(api) {
  return api.calls.map((call) => call.route)
}

test("uses the given API key without signing in", async (t) => {
  const api = fakeStudioApi(t, {})

  const key = await resolveApiKey({ ...ACCOUNT, apiKey: "given-key" })

  assert.equal(key, "given-key")
  assert.equal(api.calls.length, 0)
})

test("without key nor account, gives no key and calls nothing", async (t) => {
  const api = fakeStudioApi(t, {})

  assert.equal(await resolveApiKey({ apiUrl: ACCOUNT.apiUrl }), null)
  assert.equal(api.calls.length, 0)
})

test("fails on an account given by half", async () => {
  for (const half of [{ email: ACCOUNT.email }, { password: "password" }]) {
    await assert.rejects(
      resolveApiKey({ apiUrl: ACCOUNT.apiUrl, ...half }),
      /SUPER_ADMIN_EMAIL and SUPER_ADMIN_PWD go together/,
    )
  }
})

test("creates the key of the service at the first run", async (t) => {
  const api = fakeStudioApi(t, {
    ...SESSION,
    // A key that only has the name of the service is not its key
    [`GET ${TOKENS}`]: () =>
      keyList({ userId: "x", firstname: "studio-tasks" }),
    [`POST ${TOKENS}`]: () => ({
      status: 201,
      body: { auth_token: "new-key" },
    }),
  })

  const key = await resolveApiKey(ACCOUNT)

  assert.equal(key, "new-key")
  assert.deepEqual(api.calls[0].body, {
    email: "admin@example.com",
    password: "password",
  })
  const creation = api.calls[2]
  assert.equal(creation.authorization, "Bearer session")
  assert.deepEqual(creation.body, {
    name: "studio-tasks",
    role: 9,
    expires_in: "1y",
    metadata: '{"service":"studio-tasks"}',
  })
})

test("reads back the key kept by studio-api, then signs out", async (t) => {
  const api = fakeStudioApi(t, {
    ...SESSION,
    [`GET ${TOKENS}`]: () => keyList(serviceKey(false)),
    [`GET ${TOKENS}/key-1`]: () => ({ body: { auth_token: "kept-key" } }),
  })

  const key = await resolveApiKey(ACCOUNT)

  assert.equal(key, "kept-key")
  assert.deepEqual(routesOf(api), [
    LOGIN,
    `GET ${TOKENS}`,
    `GET ${TOKENS}/key-1`,
    LOGOUT,
  ])
})

test("looks for the key on every page of the list", async (t) => {
  const others = Array.from({ length: 100 }, (_, index) => ({
    userId: `other-${index}`,
  }))
  const api = fakeStudioApi(t, {
    ...SESSION,
    [`GET ${TOKENS}`]: (call) => {
      let list = others
      if (call.query.page === "1") list = [serviceKey(false)]
      return { body: { count: 101, list } }
    },
    [`GET ${TOKENS}/key-1`]: () => ({ body: { auth_token: "kept-key" } }),
  })

  const key = await resolveApiKey(ACCOUNT)

  assert.equal(key, "kept-key")
  assert.deepEqual(
    api.calls.slice(1, 3).map((call) => call.query.page),
    ["0", "1"],
  )
})

test("renews the key once it has expired", async (t) => {
  const api = fakeStudioApi(t, {
    ...SESSION,
    [`GET ${TOKENS}`]: () => keyList(serviceKey(true)),
    [`PUT ${TOKENS}/key-1`]: () => ({ body: { auth_token: "renewed-key" } }),
  })

  const key = await resolveApiKey(ACCOUNT)

  assert.equal(key, "renewed-key")
  assert.deepEqual(api.calls[2].body, { expires_in: "1y" })
})

test("fails when the account is refused", async (t) => {
  fakeStudioApi(t, {
    [LOGIN]: () => ({ status: 401, body: { message: "Invalid credential" } }),
  })

  await assert.rejects(
    resolveApiKey(ACCOUNT),
    /studio-api answered 401 on POST \/auth\/login/,
  )
})

test("signs out even when the key cannot be read", async (t) => {
  const api = fakeStudioApi(t, {
    ...SESSION,
    [`GET ${TOKENS}`]: () => ({ status: 403, body: { message: "Refused" } }),
  })

  await assert.rejects(resolveApiKey(ACCOUNT), /studio-api answered 403/)
  assert.equal(routesOf(api).at(-1), LOGOUT)
})
