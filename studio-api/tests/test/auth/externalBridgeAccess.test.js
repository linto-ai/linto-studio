jest.mock("debug", () => () => () => {})
const mockModel = { users: { getById: jest.fn() } }
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)

const ROLE = require(`${process.cwd()}/lib/dao/users/platformRole`)
const platform = require(
  `${process.cwd()}/components/WebServer/middlewares/access/platform`,
)
const { externalExchangeLimiter } = require(
  `${process.cwd()}/components/WebServer/config/express/rateLimiters`,
)
const externalRoutes = require(
  `${process.cwd()}/components/WebServer/routes/api/auth/external`,
)()

async function run(role, query = {}) {
  mockModel.users.getById.mockResolvedValue([{ _id: "u", role }])
  const next = jest.fn()
  await platform.isPlatformSystemAdministrator(
    { payload: { data: { userId: "u" } }, query, method: "POST" },
    {},
    next,
  )
  return next.mock.calls[0][0]
}

test("both bridge routes require a system administrator and are rate limited", () => {
  expect(externalRoutes.map((r) => `${r.method} ${r.path}`).sort()).toEqual([
    "post /resolve",
    "post /token",
  ])
  for (const route of externalRoutes) {
    expect(route.requireAuth).toBe(true)
    expect(route.requireSystemAdministrator).toBe(true)
    expect(route.controller[0]).toBe(externalExchangeLimiter)
  }
})

test("a SYSTEM_ADMINISTRATOR passes only with the backoffice scope", async () => {
  expect((await run(ROLE.systemAdministratorRole())).status).toBe(403)
  expect(
    await run(ROLE.systemAdministratorRole(), { userScope: "backoffice" }),
  ).toBeUndefined()
})

test("a plain user or an organization initiator is refused", async () => {
  expect((await run(ROLE.USER, { userScope: "backoffice" })).status).toBe(403)
  expect(
    (await run(ROLE.organizationInitiatorRole(), { userScope: "backoffice" }))
      .status,
  ).toBe(403)
})

// A fresh limiter behind a real server, the caller taken from a header
async function withLimiter(limit, run) {
  if (limit) process.env.EXTERNAL_EXCHANGE_RATE_LIMIT = limit
  let limiter
  jest.isolateModules(() => {
    ;({ externalExchangeLimiter: limiter } = require(
      `${process.cwd()}/components/WebServer/config/express/rateLimiters`,
    ))
  })
  delete process.env.EXTERNAL_EXCHANGE_RATE_LIMIT
  const app = require("express")()
  app.use((req, res, next) => {
    req.payload = { data: { userId: req.headers["x-caller"] } }
    next()
  })
  app.post("/token", limiter, (req, res) => res.status(200).send({}))
  const server = app.listen(0)
  const url = `http://127.0.0.1:${server.address().port}/token`
  try {
    await run((caller) =>
      fetch(url, { method: "POST", headers: { "x-caller": caller } }),
    )
  } finally {
    server.close()
  }
}

test("the bridge limit counts per caller credential, not per IP", async () => {
  await withLimiter("2", async (call) => {
    const statuses = []
    for (let i = 0; i < 3; i++) statuses.push((await call("a")).status)
    expect(statuses).toEqual([200, 200, 429])
    expect((await call("b")).status).toBe(200)
  })
})

test("an integration gets 3000 exchanges a minute by default", async () => {
  await withLimiter(undefined, async (call) => {
    expect((await call("a")).headers.get("ratelimit-limit")).toBe("3000")
  })
})
