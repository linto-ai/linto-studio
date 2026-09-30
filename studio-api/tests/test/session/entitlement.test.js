const mockLiveAdmit = jest.fn(async () => ({ allowed: true }))
const mockEnforce = jest.fn(async () => ({ allowed: true }))

jest.mock(`${process.cwd()}/lib/saas`, () => ({
  enabled: () => true,
  liveAdmit: (...args) => mockLiveAdmit(...args),
  enforce: (...args) => mockEnforce(...args),
}))

const { build } = require(
  `${process.cwd()}/components/WebServer/middlewares/access/entitlement.js`,
)

const run = (spec, req) =>
  new Promise((resolve) => build(spec)(req, {}, (err) => resolve(err)))

const post = (body) => ({
  method: "POST",
  params: { organizationId: "org-1" },
  payload: { data: { userId: "user-1" } },
  body,
})

beforeEach(() => {
  mockLiveAdmit.mockClear()
  mockEnforce.mockClear()
})

describe("requireEntitlement: a gate whose value resolves to 0 is skipped", () => {
  const spec = [
    {
      liveAdmit: true,
      methods: ["post"],
      languagesFrom: (req) => req.body.live,
    },
    {
      capability: "import.minutes",
      methods: ["post"],
      valueFrom: (req) => req.body.offline,
    },
  ]

  test("record only: import quota checked, no live admission", async () => {
    expect(await run(spec, post({ live: 0, offline: 1 }))).toBeUndefined()
    expect(mockLiveAdmit).not.toHaveBeenCalled()
    expect(mockEnforce).toHaveBeenCalledWith({
      orgId: "org-1",
      capability: "import.minutes",
      value: 1,
      userId: "user-1",
    })
  })

  test("live only: admission on the languages, no import check", async () => {
    expect(await run(spec, post({ live: 2, offline: 0 }))).toBeUndefined()
    expect(mockLiveAdmit).toHaveBeenCalledWith({
      orgId: "org-1",
      languages: 2,
      userId: "user-1",
    })
    expect(mockEnforce).not.toHaveBeenCalled()
  })

  test("both: both gates run", async () => {
    await run(spec, post({ live: 1, offline: 1 }))
    expect(mockLiveAdmit).toHaveBeenCalledTimes(1)
    expect(mockEnforce).toHaveBeenCalledTimes(1)
  })

  test("a fixed value of 0 is still enforced, only resolved values skip", async () => {
    await run({ capability: "ai.chat", value: 0 }, post({}))
    expect(mockEnforce).toHaveBeenCalledTimes(1)
  })

  test("a refusal is passed to next", async () => {
    mockLiveAdmit.mockRejectedValueOnce(new Error("credit_exhausted"))
    const err = await run(spec, post({ live: 1, offline: 0 }))
    expect(err && err.message).toBe("credit_exhausted")
  })
})
