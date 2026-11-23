jest.mock("debug", () => () => () => {})
process.env.SESSION_API_ENDPOINT = "http://sessionapi:8005/v1"
process.env.SESSION_PSW_SALT = "salt"
process.env.CM_JWT_SECRET = "test-cm-secret"

const mockModel = {
  users: { getByIdFilter: jest.fn() },
  organizations: { getById: jest.fn() },
  externalEntitlements: { findUser: jest.fn(), findDomain: jest.fn() },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)
// The key owns every session and template it is asked about
jest.mock(`${process.cwd()}/lib/utility/axios`, () => ({
  get: async () => ({ owner: "k1" }),
}))
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/session/conversation.js`,
  () => ({
    storeSessionFromStop: jest.fn(),
    storeQuickMeetingFromStop: jest.fn(),
  }),
)
jest.mock(`${process.cwd()}/lib/logger/logger`, () => ({
  info() {},
  warn() {},
  error() {},
  debug() {},
}))
jest.mock(
  `${process.cwd()}/components/WebServer/config/passport/middleware`,
  () => ({
    isAuthenticate: (req, res, next) => next(),
    refresh_token: (req, res, next) => next(),
  }),
)
jest.mock(
  `${process.cwd()}/components/WebServer/middlewares/logger/logger.js`,
  () => ({ logger: (req, res, next) => next() }),
)
jest.mock("http-proxy-middleware", () => ({
  createProxyMiddleware: () => () => {},
  fixRequestBody: () => {},
  responseInterceptor: (handler) => handler,
}))
jest.mock(`${process.cwd()}/components/WebServer/routes/routes.js`, () =>
  jest.fn((webServer) => ({
    api_routes: {},
    proxy_routes: [
      require(
        `${process.cwd()}/components/WebServer/routes/proxy/sessions/session.js`,
      )(webServer),
    ],
  })),
)

const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)

const KEY = "k1"
const ORG = "org"

// What the router registers: method + path -> the middlewares before the proxy
const registered = {}
const express = new Proxy(
  {},
  {
    get: (_, method) => (path, middlewares) => {
      registered[`${method.toUpperCase()} ${path}`] = middlewares
    },
  },
)
require(`${process.cwd()}/components/WebServer/routes/router.js`)({ express })

const ENDS = [
  "DELETE /api/organizations/:organizationId/templates/:id",
  "DELETE /api/organizations/:organizationId/quickMeeting/:id",
  "DELETE /api/organizations/:organizationId/bots/:id",
  "DELETE /api/organizations/:organizationId/sessions/:id",
  "PUT /api/organizations/:organizationId/sessions/:id/stop",
  "PUT /api/organizations/:organizationId/sessions/:id/pause",
  "PUT /api/organizations/:organizationId/sessions/:id/clear",
]
const STARTS = [
  "POST /api/organizations/:organizationId/quickMeeting/",
  "POST /api/organizations/:organizationId/sessions/",
  "POST /api/organizations/:organizationId/bots",
  "PUT /api/organizations/:organizationId/sessions/:id/resume",
]

function entitle(features) {
  mockModel.externalEntitlements.findUser.mockResolvedValue([
    {
      _id: "u",
      kind: "user",
      organizationId: ORG,
      provider: "meet:linagora",
      subject: "lemon-42",
      email: "alice@linagora.com",
      features,
    },
  ])
}

// Runs the registered chain as Express would, up to the proxy
async function call(route) {
  const [method] = route.split(" ")
  const req = {
    method,
    path: "/",
    payload: { data: { userId: KEY } },
    params: { organizationId: ORG, id: "s1" },
    body: { channels: [{}] },
    query: {},
  }
  for (const middleware of registered[route]) {
    let outcome
    try {
      await middleware(req, {}, (err) => (outcome = err || true))
    } catch (err) {
      outcome = err
    }
    if (outcome !== true) return outcome || new Error("stopped")
  }
}

function asKey(metadata = {}) {
  mockModel.users.getByIdFilter.mockResolvedValue([
    {
      _id: KEY,
      type: "machine",
      metadata: {
        externalIdentity: {
          provider: "meet:linagora",
          subject: "lemon-42",
          email: "alice@linagora.com",
        },
        organizationId: ORG,
        ...metadata,
      },
    },
  ])
}

function withPermissions(permissions) {
  mockModel.organizations.getById.mockResolvedValue([
    { _id: ORG, permissions, users: [{ userId: KEY, role: ROLES.ADMIN }] },
  ])
}

beforeEach(() => {
  jest.clearAllMocks()
  asKey()
  withPermissions(63)
  mockModel.externalEntitlements.findDomain.mockResolvedValue([])
  entitle({ transcription: { live: false, async: true } })
})

describe("a key that lost transcription.live", () => {
  test.each(ENDS)("can still %s", async (route) => {
    expect(registered[route]).toBeDefined()
    expect(await call(route)).toBeUndefined()
  })

  test.each(STARTS)("cannot %s", async (route) => {
    const err = await call(route)
    expect(err.code).toBe("no_entitlement")
    expect(err.capability).toBe("transcription.live")
  })

  test.each([
    "GET /api/organizations/:organizationId/bots/:id",
    "GET /api/organizations/:organizationId/quickMeeting/",
    "GET /api/organizations/:organizationId/templates/:id",
  ])("cannot read either: %s", async (route) => {
    expect((await call(route)).code).toBe("no_entitlement")
  })

  test("an end still needs the organization permission and role", async () => {
    mockModel.organizations.getById.mockResolvedValue([
      { _id: ORG, permissions: 0, users: [{ userId: KEY, role: ROLES.ADMIN }] },
    ])
    const err = await call(ENDS[1])
    expect(err.status).toBe(403)
    expect(err.code).not.toBe("no_entitlement")

    mockModel.organizations.getById.mockResolvedValue([
      { _id: ORG, permissions: 63, users: [] },
    ])
    expect((await call(ENDS[1])).status).toBe(403)
  })

  test("the ends are the only routes a key without any right passes through a permission", async () => {
    entitle({})
    const exempted = []
    for (const route of Object.keys(registered)) {
      withPermissions(63)
      const withoutRights = await call(route)
      withPermissions(0)
      const withoutPermission = await call(route)
      if (withoutRights === undefined && withoutPermission) exempted.push(route)
    }
    expect(exempted.sort()).toEqual([...ENDS].sort())
  })
})

describe("POST quickMeeting", () => {
  test("refuses a key barred from quick meetings by its metadata", async () => {
    entitle({ transcription: { live: true } })
    asKey({ quickMeeting: false })
    const err = await call(STARTS[0])
    expect(err.code).toBe("quick_meeting_disabled")
    asKey({ quickMeeting: true })
    expect(await call(STARTS[0])).toBeUndefined()
  })
})
