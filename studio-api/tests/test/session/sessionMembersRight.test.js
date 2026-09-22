jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({}))
jest.mock(`${process.cwd()}/lib/utility/axios`, () => ({}))
jest.mock(
  `${process.cwd()}/components/WebServer/config/express/rateLimiters`,
  () => ({ authFailLimiter: jest.fn() }),
)
jest.mock(
  `${process.cwd()}/components/WebServer/config/passport/token/public_generator`,
  () => ({}),
)

const { checkSessionMembersRight, chainBeforeResult } = require(
  `${process.cwd()}/components/WebServer/controllers/session/session.js`,
)

async function check(body) {
  const req = { body, params: { organizationId: "org" } }
  const next = jest.fn()
  await checkSessionMembersRight(req, next)
  return { req, next }
}

describe("checkSessionMembersRight", () => {
  test("passes through without meta or without membersRight", async () => {
    expect((await check({})).next).toHaveBeenCalledWith()
    expect((await check({ meta: {} })).next).toHaveBeenCalledWith()
  })

  test("normalizes a valid right, none included", async () => {
    const { req, next } = await check({ meta: { membersRight: "0" } })
    expect(next).toHaveBeenCalledWith()
    expect(req.body.meta.membersRight).toBe(0)

    const admin = await check({ meta: { membersRight: 31 } })
    expect(admin.req.body.meta.membersRight).toBe(31)
  })

  test("rejects an invalid right", async () => {
    for (const membersRight of [32, -1, "abc"]) {
      const { next } = await check({ meta: { membersRight } })
      expect(next).toHaveBeenCalledWith(expect.any(Error))
    }
  })
})

describe("chainBeforeResult", () => {
  test("runs handlers in order and stops on the first error", () => {
    const calls = []
    const next = jest.fn()
    chainBeforeResult(
      (req, n) => {
        calls.push("a")
        n()
      },
      (req, n) => n(new Error("boom")),
      (req, n) => {
        calls.push("never")
        n()
      },
    )({}, next)
    expect(calls).toEqual(["a"])
    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })
})
