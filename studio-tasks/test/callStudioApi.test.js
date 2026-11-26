const test = require("node:test")
const assert = require("node:assert/strict")

const { callStudioApi, callBackoffice } = require("../lib/callStudioApi")
const { fakeStudioApi } = require("./fakeStudioApi")

test("keeps the path of the API url, whatever its ending", async (t) => {
  const api = fakeStudioApi(t, {
    "GET /cm-api/auth/isAuth": () => ({ body: {} }),
  })

  await callStudioApi("https://studio.example.com/cm-api", "/auth/isAuth")
  await callStudioApi("https://studio.example.com/cm-api/", "/auth/isAuth")

  assert.equal(api.calls.length, 2)
  assert.equal(api.calls[1].route, "GET /cm-api/auth/isAuth")
})

test("sends the token and the JSON body", async (t) => {
  const api = fakeStudioApi(t, {
    "POST /auth/login": () => ({ status: 202, body: { auth_token: "s" } }),
  })

  const answer = await callStudioApi("http://studio-api", "/auth/login", {
    method: "POST",
    token: "secret",
    body: { email: "a@example.com" },
  })

  assert.deepEqual(answer, { auth_token: "s" })
  assert.equal(api.calls[0].authorization, "Bearer secret")
  assert.deepEqual(api.calls[0].body, { email: "a@example.com" })
})

test("a backoffice call carries the backoffice scope with its query", async (t) => {
  const api = fakeStudioApi(t, {
    "GET /api/administration/tokens": () => ({ body: { list: [] } }),
  })

  await callBackoffice("http://studio-api", "/tokens", { query: { page: 2 } })

  assert.deepEqual(api.calls[0].query, { page: "2", userScope: "backoffice" })
})

test("fails with the answer of studio-api when it refuses", async (t) => {
  fakeStudioApi(t, {
    "GET /api/administration/tokens": () => ({
      status: 403,
      body: { message: "Not allowed to do this" },
    }),
  })

  await assert.rejects(
    callBackoffice("http://studio-api", "/tokens"),
    /studio-api answered 403 on GET \/api\/administration\/tokens: .*Not allowed/,
  )
})
