jest.mock("debug", () => () => () => {})
process.env.SESSION_API_ENDPOINT = "http://sessionapi:8005/v1"
process.env.SESSION_PSW_SALT = "salt"
process.env.CM_JWT_SECRET = "test-cm-secret"

const mockModel = {
  users: {
    getByIdFilter: jest.fn(),
    getById: jest.fn(),
    isExternalKey: jest.fn(),
  },
  organizations: {
    getById: jest.fn(),
    getByIdAndUser: jest.fn(),
    listSelf: jest.fn(),
  },
  externalEntitlements: { findUser: jest.fn(), findDomain: jest.fn() },
  conversations: { getById: jest.fn(), update: jest.fn() },
  categories: { getSystemCategories: jest.fn() },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)
jest.mock(`${process.cwd()}/lib/mailer/mailing`, () => ({}))
for (const dep of [
  "controllers/conversation/utility",
  "controllers/conversation/child",
]) {
  jest.mock(`${process.cwd()}/components/WebServer/${dep}`, () => ({
    updateChildConversation: jest.fn(),
  }))
}
const mockAxios = { get: jest.fn() }
jest.mock(`${process.cwd()}/lib/utility/axios`, () => mockAxios)
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/session/conversation.js`,
  () => ({
    storeSessionFromStop: jest.fn(),
    storeQuickMeetingFromStop: jest.fn(),
  }),
)
jest.mock(
  `${process.cwd()}/components/WebServer/routecontrollers/session/catchup.js`,
  () => ({ catchUp: jest.fn(), catchUpStatus: jest.fn() }),
)
jest.mock(
  `${process.cwd()}/components/WebServer/routecontrollers/session/data.js`,
  () => ({}),
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
    api_routes: {
      "/api/organizations/:organizationId/sessions/:id/catchup": require(
        `${process.cwd()}/components/WebServer/routes/api/sessions/catchup.js`,
      )(webServer),
      "/api/organizations/:organizationId/sessions": require(
        `${process.cwd()}/components/WebServer/routes/api/sessions/data.js`,
      )(webServer),
    },
    proxy_routes: [
      require(
        `${process.cwd()}/components/WebServer/routes/proxy/sessions/session.js`,
      )(webServer),
    ],
  })),
)

const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const sessionProxy = require(
  `${process.cwd()}/components/WebServer/routes/proxy/sessions/session.js`,
)
const { updateConversationMembersRight } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/conversation/share.js`,
)
const { getOrganization, listSelfOrganization } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/organizations.js`,
)

const ROOT = "0123456789abcdef01234567"
const ALICE = "aaaaaaaaaaaaaaaaaaaaaaaa"
const BOB = "bbbbbbbbbbbbbbbbbbbbbbbb"
const HUMAN = "cccccccccccccccccccccccc"
const EVERYTHING = {
  transcription: { live: true, async: true },
  summary: true,
}

// Alice and Bob: two customers of the external system, keys of the root
const externalKey = (id, email) => ({
  _id: id,
  type: "machine",
  role: 0,
  metadata: {
    externalIdentity: { provider: "twake", subject: email, email },
    organizationId: ROOT,
  },
})
const PEOPLE = {
  [ALICE]: externalKey(ALICE, "alice@acme.fr"),
  [BOB]: externalKey(BOB, "bob@globex.fr"),
  [HUMAN]: { _id: HUMAN, type: "user", role: 1, metadata: {} },
}
const SESSIONS = {
  "s-alice": { id: "s-alice", organizationId: ROOT, owner: ALICE },
  "s-bob": { id: "s-bob", organizationId: ROOT, owner: BOB },
}
const TEMPLATES = {
  "t-alice": { id: "t-alice", organizationId: ROOT, owner: ALICE },
  "t-bob": { id: "t-bob", organizationId: ROOT, owner: BOB },
}

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

// Runs the registered chain as Express would, up to the proxy or controller
async function call(route, caller, id) {
  const [method] = route.split(" ")
  const req = {
    method,
    path: "/",
    payload: { data: { userId: caller } },
    params: { organizationId: ROOT, id },
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

beforeEach(() => {
  jest.clearAllMocks()
  mockModel.users.getByIdFilter.mockImplementation(async (id) =>
    PEOPLE[id] ? [PEOPLE[id]] : [],
  )
  mockModel.users.isExternalKey.mockImplementation(
    async (id) => !!PEOPLE[id]?.metadata.externalIdentity,
  )
  mockModel.organizations.getById.mockResolvedValue([
    {
      _id: ROOT,
      permissions: 63,
      users: [ALICE, BOB, HUMAN].map((userId) => ({
        userId,
        role: ROLES.MEETING_MANAGER,
      })),
    },
  ])
  mockModel.externalEntitlements.findUser.mockResolvedValue([
    { kind: "user", organizationId: ROOT, features: EVERYTHING },
  ])
  mockModel.externalEntitlements.findDomain.mockResolvedValue([])
  mockAxios.get.mockImplementation(async (url) => {
    const [, resource, id] = url.match(/\/(sessions|templates)\/([^/?]+)/)
    return (resource === "sessions" ? SESSIONS : TEMPLATES)[id]
  })
})

const SESSION_ROUTES = [
  "GET /api/organizations/:organizationId/sessions/:id",
  "GET /api/organizations/:organizationId/sessions/:id/channels/:channelId",
  "PUT /api/organizations/:organizationId/sessions/:id",
  "PATCH /api/organizations/:organizationId/sessions/:id",
  "DELETE /api/organizations/:organizationId/sessions/:id",
  "PUT /api/organizations/:organizationId/sessions/:id/stop",
  "PUT /api/organizations/:organizationId/sessions/:id/pause",
  "PUT /api/organizations/:organizationId/sessions/:id/resume",
  "PUT /api/organizations/:organizationId/sessions/:id/clear",
  "DELETE /api/organizations/:organizationId/quickMeeting/:id",
  "POST /api/organizations/:organizationId/sessions/:id/catchup/",
  "GET /api/organizations/:organizationId/sessions/:id/catchup/status",
]
const TEMPLATE_ROUTES = [
  "GET /api/organizations/:organizationId/templates/:id",
  "PUT /api/organizations/:organizationId/templates/:id",
  "DELETE /api/organizations/:organizationId/templates/:id",
]

describe("a session or a template of another customer", () => {
  test.each(SESSION_ROUTES)("is not found: %s", async (route) => {
    expect(registered[route]).toBeDefined()
    expect((await call(route, BOB, "s-alice"))?.status).toBe(404)
    expect(await call(route, ALICE, "s-alice")).toBeUndefined()
  })

  test.each(TEMPLATE_ROUTES)("is not found: %s", async (route) => {
    expect((await call(route, BOB, "t-alice"))?.status).toBe(404)
    expect(await call(route, ALICE, "t-alice")).toBeUndefined()
  })

  test("a member who is not an external key keeps the organization's access", async () => {
    for (const route of SESSION_ROUTES) {
      expect(await call(route, HUMAN, "s-alice")).toBeUndefined()
    }
  })
})

describe("the aliases and passwords of the sessions", () => {
  const DATA_ROUTES = [
    "POST /api/organizations/:organizationId/sessions/data",
    "GET /api/organizations/:organizationId/sessions/data/",
    "GET /api/organizations/:organizationId/sessions/data/:id",
    "PUT /api/organizations/:organizationId/sessions/data/:id",
    "DELETE /api/organizations/:organizationId/sessions/data/:id",
    "DELETE /api/organizations/:organizationId/sessions/data/:id/password",
  ]

  test.each(DATA_ROUTES)("are not for an external key: %s", async (route) => {
    expect((await call(route, ALICE, "d1"))?.status).toBe(403)
    expect(await call(route, HUMAN, "d1")).toBeUndefined()
  })
})

function pathOf(method, path) {
  for (const proxyPath of sessionProxy({}).proxyPaths) {
    const found = proxyPath.paths.find(
      (p) => p.path === path && p.method.includes(method),
    )
    if (found) return found
  }
}

// The response of the Session-API, through the after-result chain of the path
async function listed(method, path, caller, body) {
  const req = {
    payload: { data: { userId: caller } },
    params: { organizationId: ROOT },
    userRole: ROLES.MEETING_MANAGER,
  }
  let result = JSON.stringify(body)
  for (const after of pathOf(method, path).executeAfterResult || []) {
    result = await after(result, req)
  }
  return JSON.parse(result)
}

describe("the listings", () => {
  const stream = [{ streamEndpoints: { srt: "srt://secret" } }]
  const sessions = {
    totalItems: 3,
    sessions: [
      { ...SESSIONS["s-alice"], visibility: "public", channels: stream },
      { ...SESSIONS["s-bob"], visibility: "public", channels: stream },
      { id: "s-human", owner: HUMAN, visibility: "private", channels: stream },
    ],
  }

  test("an external key lists its own sessions only, with their endpoints", async () => {
    const out = await listed(
      "get",
      "/organizations/:organizationId/sessions",
      ALICE,
      sessions,
    )
    expect(out.sessions.map((s) => s.id)).toEqual(["s-alice"])
    expect(out.totalItems).toBe(1)
    expect(out.sessions[0].channels[0].streamEndpoints).toBeDefined()
  })

  test("an external key lists its own templates only", async () => {
    const out = await listed(
      "get",
      "/organizations/:organizationId/templates",
      BOB,
      {
        totalItems: 2,
        sessionTemplates: Object.values(TEMPLATES),
      },
    )
    expect(out.sessionTemplates.map((t) => t.id)).toEqual(["t-bob"])
    expect(out.totalItems).toBe(1)
  })

  test("a member who is not an external key lists as before", async () => {
    const out = await listed(
      "get",
      "/organizations/:organizationId/sessions",
      HUMAN,
      sessions,
    )
    expect(out.sessions).toHaveLength(3)
  })
})

describe("the members right of a conversation owned by an external key", () => {
  async function patch(owner, membersRight) {
    mockModel.conversations.getById.mockResolvedValue([
      { _id: "c1", owner, organization: { membersRight: 0 }, type: {} },
    ])
    mockModel.conversations.update.mockResolvedValue({ matchedCount: 1 })
    const res = { status: jest.fn(() => res), send: jest.fn() }
    const next = jest.fn()
    await updateConversationMembersRight(
      { params: { conversationId: "c1" }, body: { membersRight } },
      res,
      next,
    )
    return next.mock.calls[0]?.[0]
  }

  test("is never opened to the organization", async () => {
    expect((await patch(ALICE, 1))?.name).toBe("ConversationShareAccessDenied")
    expect(mockModel.conversations.update).not.toHaveBeenCalled()
    expect(await patch(ALICE, 0)).toBeUndefined()
  })

  test("a conversation of a human is shared as before", async () => {
    expect(await patch(HUMAN, 1)).toBeUndefined()
  })
})

describe("the members of the root organization", () => {
  async function members(caller) {
    mockModel.organizations.getByIdAndUser.mockResolvedValue([
      {
        _id: ROOT,
        users: [ALICE, BOB, HUMAN].map((userId) => ({
          userId,
          role: ROLES.MEETING_MANAGER,
          ...(userId === HUMAN ? {} : { type: "machine" }),
        })),
      },
    ])
    mockModel.users.getById.mockImplementation(async (id) => [PEOPLE[id]])
    const res = { status: jest.fn(() => res), send: jest.fn() }
    await getOrganization(
      {
        params: { organizationId: ROOT },
        payload: { data: { userId: caller } },
        query: { includeM2m: "true" },
      },
      res,
      jest.fn(),
    )
    return res.send.mock.calls[0][0].users.map((u) => u.userId)
  }

  test("an external key sees itself only", async () => {
    expect(await members(ALICE)).toEqual([ALICE])
  })

  test("a human member sees them all", async () => {
    expect(await members(HUMAN)).toEqual([ALICE, BOB, HUMAN])
  })

  test("listing its organizations, an external key sees itself only", async () => {
    const list = async (caller) => {
      mockModel.organizations.listSelf.mockResolvedValue([
        {
          _id: ROOT,
          users: [ALICE, BOB, HUMAN].map((userId) => ({ userId, role: 4 })),
        },
      ])
      const res = { status: jest.fn(() => res), send: jest.fn() }
      await listSelfOrganization(
        { payload: { data: { userId: caller } } },
        res,
        jest.fn(),
      )
      return res.send.mock.calls[0][0][0].users.map((u) => u.userId)
    }
    expect(await list(BOB)).toEqual([BOB])
    expect(await list(HUMAN)).toEqual([ALICE, BOB, HUMAN])
  })
})
