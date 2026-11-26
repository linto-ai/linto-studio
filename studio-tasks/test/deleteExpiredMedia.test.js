const test = require("node:test")
const assert = require("node:assert/strict")

const { deleteExpiredMedia } = require("../tasks/deleteExpiredMedia")
const { fakeStudioApi } = require("./fakeStudioApi")

test("calls the backoffice route with the API key", async (t) => {
  const api = fakeStudioApi(t, {
    "DELETE /api/administration/conversations/expired": () => ({
      body: { deleted: 3, failed: 1 },
    }),
  })

  const result = await deleteExpiredMedia({
    apiUrl: "http://studio-api",
    apiKey: "secret",
  })

  assert.deepEqual(result, { deleted: 3, failed: 1 })
  assert.equal(api.calls.length, 1)
  assert.equal(api.calls[0].authorization, "Bearer secret")
  assert.deepEqual(api.calls[0].query, { userScope: "backoffice" })
})
