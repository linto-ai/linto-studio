const mockDecide = jest.fn()

jest.mock(`${process.cwd()}/lib/saas`, () => ({
  decide: (...args) => mockDecide(...args),
}))

const { build } = require(
  `${process.cwd()}/components/WebServer/middlewares/access/entitlement.js`,
)

const run = (spec, req) =>
  new Promise((resolve) => build(spec)(req, {}, (err) => resolve(err)))

beforeEach(() => mockDecide.mockReset())

describe("requireEntitlement: the route flag is decided by the plugin", () => {
  const spec = { liveAdmit: true, methods: ["post"] }
  const req = { method: "POST", params: { organizationId: "org-1" } }

  test("hands the flag and the request over, then continues", async () => {
    mockDecide.mockResolvedValue({ allowed: true })
    expect(await run(spec, req)).toBeUndefined()
    expect(mockDecide).toHaveBeenCalledWith("gateRoute", spec, req)
  })

  test("a refusal is passed to next", async () => {
    mockDecide.mockRejectedValue(new Error("credit_exhausted"))
    const err = await run(spec, req)
    expect(err && err.message).toBe("credit_exhausted")
  })
})
