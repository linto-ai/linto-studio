jest.mock("debug", () => () => () => {})
process.env.SESSION_API_ENDPOINT = "http://sessionapi:8005/v1"
process.env.SESSION_PSW_SALT = "salt"
process.env.CM_JWT_SECRET = "test-cm-secret"

const mockModel = {
  users: { getByIdFilter: jest.fn() },
  organizations: { getById: jest.fn() },
  conversations: { getById: jest.fn() },
  externalEntitlements: { findUser: jest.fn(), findDomain: jest.fn() },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)
const mockAxios = { get: jest.fn(), post: jest.fn() }
jest.mock(`${process.cwd()}/lib/utility/axios`, () => mockAxios)
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

const PERMISSIONS = require(`${process.cwd()}/lib/dao/organization/permissions`)
const access = require(
  `${process.cwd()}/components/WebServer/middlewares/access/organization`,
)
const { quickMeetingAccess } = require(
  `${process.cwd()}/components/WebServer/middlewares/access/externalEntitlement`,
)
const sessionProxy = require(
  `${process.cwd()}/components/WebServer/routes/proxy/sessions/session`,
)

const KEY = "k1"
const ALL_PERMISSIONS = 63
const NOTHING = {}
const LIVE_ONLY = { transcription: { live: true, async: false } }
const ASYNC_ONLY = { transcription: { live: false, async: true } }

// The same map as the router's, bit by bit
const GATE = {
  [PERMISSIONS.UPLOAD]: access.permissionUpload,
  [PERMISSIONS.SUMMARY]: access.permissionSummary,
  [PERMISSIONS.MICROPHONE]: access.permissionMicrophone,
  [PERMISSIONS.BOT]: access.permissionBot,
  [PERMISSIONS.SESSION]: access.permissionSession,
  [PERMISSIONS.SPEAKER_IDENTIFICATION]: access.permissionSpeakerIdentification,
}

function externalKey(metadata = {}) {
  return {
    _id: KEY,
    type: "machine",
    metadata: {
      externalIdentity: {
        provider: "meet:linagora",
        subject: "lemon-42",
        email: "alice@linagora.com",
      },
      organizationId: "org",
      ...metadata,
    },
  }
}

function entitle(features) {
  mockModel.externalEntitlements.findUser.mockResolvedValue([
    {
      _id: "u",
      kind: "user",
      organizationId: "root",
      provider: "meet:linagora",
      subject: "lemon-42",
      email: "alice@linagora.com",
      features,
    },
  ])
}

function req(method = "POST", extra = {}) {
  return {
    method,
    path: "/",
    payload: { data: { userId: KEY } },
    params: { organizationId: "org" },
    body: { channels: [{}] },
    query: {},
    ...extra,
  }
}

async function gate(permission, r = req()) {
  const next = jest.fn()
  await GATE[permission](r, {}, next)
  expect(next).toHaveBeenCalledTimes(1)
  return next.mock.calls[0][0]
}

async function gatesOf(permissions, r) {
  for (const [bit, middleware] of Object.entries(GATE)) {
    if ((permissions & bit) !== Number(bit)) continue
    const next = jest.fn()
    await middleware(r, {}, next)
    if (next.mock.calls[0][0]) return next.mock.calls[0][0]
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  mockAxios.get.mockResolvedValue({ totalItems: 0 })
  mockModel.organizations.getById.mockResolvedValue([
    { _id: "org", permissions: ALL_PERMISSIONS, users: [] },
  ])
  mockModel.users.getByIdFilter.mockResolvedValue([externalKey()])
  mockModel.externalEntitlements.findUser.mockResolvedValue([])
  mockModel.externalEntitlements.findDomain.mockResolvedValue([])
})

describe("permission gates for a key standing for an external identity", () => {
  test.each([
    ["UPLOAD", "transcription.async", PERMISSIONS.UPLOAD, ASYNC_ONLY],
    ["SUMMARY", "summary", PERMISSIONS.SUMMARY, { summary: true }],
    ["MICROPHONE", "transcription.live", PERMISSIONS.MICROPHONE, LIVE_ONLY],
    ["BOT", "transcription.live", PERMISSIONS.BOT, LIVE_ONLY],
    ["SESSION", "transcription.live", PERMISSIONS.SESSION, LIVE_ONLY],
  ])("%s needs %s", async (_, feature, permission, granting) => {
    entitle(NOTHING)
    const denied = await gate(permission)
    expect(denied.status).toBe(403)
    expect(denied.code).toBe("no_entitlement")
    expect(denied.capability).toBe(feature)

    entitle(granting)
    expect(await gate(permission)).toBeUndefined()
  })

  test("every method is gated, not only the creation", async () => {
    entitle(ASYNC_ONLY)
    for (const method of ["GET", "PUT", "PATCH", "DELETE"]) {
      expect((await gate(PERMISSIONS.BOT, req(method))).status).toBe(403)
    }
  })

  test("403 when the entitlement record is gone altogether", async () => {
    expect((await gate(PERMISSIONS.SESSION)).code).toBe("no_entitlement")
  })

  test("a domain entitlement serves its members", async () => {
    mockModel.externalEntitlements.findDomain.mockResolvedValue([
      {
        _id: "d",
        kind: "domain",
        organizationId: "root",
        domain: "linagora.com",
        features: ASYNC_ONLY,
      },
    ])
    expect(await gate(PERMISSIONS.UPLOAD)).toBeUndefined()
    expect((await gate(PERMISSIONS.SESSION)).status).toBe(403)
  })

  test("speaker identification is not gated", async () => {
    expect(await gate(PERMISSIONS.SPEAKER_IDENTIFICATION)).toBeUndefined()
  })

  test("the organization permission is checked first", async () => {
    mockModel.organizations.getById.mockResolvedValue([
      { _id: "org", permissions: PERMISSIONS.UPLOAD, users: [] },
    ])
    const err = await gate(PERMISSIONS.SESSION)
    expect(err.status).toBe(403)
    expect(err.code).not.toBe("no_entitlement")
  })

  test("a human and a key with no external identity are unaffected", async () => {
    mockModel.users.getByIdFilter.mockResolvedValue([
      { _id: KEY, type: "machine", metadata: {} },
    ])
    expect(await gate(PERMISSIONS.SESSION)).toBeUndefined()
    mockModel.users.getByIdFilter.mockResolvedValue([
      { _id: KEY, type: "user" },
    ])
    expect(await gate(PERMISSIONS.UPLOAD)).toBeUndefined()
  })

  test("a database failure never opens the gate", async () => {
    mockModel.users.getByIdFilter.mockResolvedValue(new Error("down"))
    expect((await gate(PERMISSIONS.SESSION)).message).toBe("down")
    mockModel.users.getByIdFilter.mockResolvedValue([externalKey()])
    mockModel.externalEntitlements.findUser.mockRejectedValue(new Error("down"))
    expect((await gate(PERMISSIONS.SESSION)).message).toBe("down")
  })

  test("a revoked entitlement bites on the next call", async () => {
    entitle(LIVE_ONLY)
    expect(await gate(PERMISSIONS.SESSION)).toBeUndefined()
    entitle(ASYNC_ONLY)
    expect((await gate(PERMISSIONS.SESSION)).status).toBe(403)
  })

  test("the json, text and verbatim downloads still skip the permission", async () => {
    const r = req("POST", {
      path: "/conv/download",
      params: { conversationId: "conv" },
      query: { format: "json" },
    })
    expect(await gate(PERMISSIONS.SUMMARY, r)).toBeUndefined()
  })

  test("a document download needs summary", async () => {
    mockModel.conversations.getById.mockResolvedValue([
      { _id: "conv", organization: { organizationId: "org" } },
    ])
    const r = req("POST", {
      path: "/conv/download",
      params: { conversationId: "conv" },
      query: { format: "docx" },
    })
    expect((await gate(PERMISSIONS.SUMMARY, r)).capability).toBe("summary")
  })
})

// The API route files, without their controllers
const ROUTE_CONTROLLERS = [
  "organizations/organizations",
  "organizations/member",
  "organizations/maintainer",
  "organizations/admin",
  "organizations/sso",
  "organizations/sessionNotice",
  "organizations/apiKey",
  "organizations/uploader/transcriptor",
  "organizations/uploader/offline",
  "organizations/uploader/import",
  "conversation/conversation",
  "conversation/export",
  "conversation/generations",
]
function apiRoutes(file) {
  for (const controller of ROUTE_CONTROLLERS) {
    jest.doMock(
      `${process.cwd()}/components/WebServer/routecontrollers/${controller}.js`,
      () => new Proxy({}, { get: () => function controller() {} }),
    )
  }
  return require(`${process.cwd()}/components/WebServer/routes/api/${file}`)({})
}

describe("routes reached by a key standing for an external identity", () => {
  const sessionRoutes = sessionProxy({}).proxyPaths
  const proxyGroupOf = (path, method) =>
    sessionRoutes.find((group) =>
      group.paths.some((p) => p.path === path && p.method.includes(method)),
    )

  test.each([
    ["POST sessions", "/organizations/:organizationId/sessions/", "post"],
    [
      "POST quickMeeting",
      "/organizations/:organizationId/quickMeeting/",
      "post",
    ],
    ["POST bots", "/organizations/:organizationId/bots", "post"],
  ])("%s needs transcription.live", async (_, path, method) => {
    entitle(ASYNC_ONLY)
    const { orgaPermissionAccess } = proxyGroupOf(path, method)
    expect((await gatesOf(orgaPermissionAccess, req())).capability).toBe(
      "transcription.live",
    )
    entitle(LIVE_ONLY)
    expect(await gatesOf(orgaPermissionAccess, req())).toBeUndefined()
  })

  test.each([
    [
      "regenerate",
      "transcription.async",
      "organization/organizations",
      "/:organizationId/conversations/:conversationId/regenerate",
    ],
    [
      "conversations/create",
      "transcription.async",
      "organization/organizations",
      "/:organizationId/conversations/create",
    ],
    [
      "a document download",
      "summary",
      "conversation/conversations",
      "/:conversationId/download",
    ],
  ])("%s needs %s", async (_, feature, file, path) => {
    const { orgaPermissionAccess } = apiRoutes(file).find(
      (route) => route.path === path,
    )
    mockModel.conversations.getById.mockResolvedValue([
      { _id: "conv", organization: { organizationId: "org" } },
    ])
    const r = () =>
      req("POST", {
        path: "/conv/download",
        params: { organizationId: "org", conversationId: "conv" },
        query: { format: "docx" },
      })
    expect((await gatesOf(orgaPermissionAccess, r())).capability).toBe(feature)
    entitle({ transcription: { async: true }, summary: true })
    expect(await gatesOf(orgaPermissionAccess, r())).toBeUndefined()
  })
})

describe("quick meeting", () => {
  async function startQuickMeeting() {
    const next = jest.fn()
    await quickMeetingAccess(req(), {}, next)
    return next.mock.calls[0][0]
  }

  test("a key barred by its metadata cannot start one", async () => {
    mockModel.users.getByIdFilter.mockResolvedValue([
      externalKey({ quickMeeting: false }),
    ])
    entitle(LIVE_ONLY)
    expect((await startQuickMeeting()).code).toBe("quick_meeting_disabled")
  })

  test("a key without an external identity is barred by its metadata only", async () => {
    mockModel.users.getByIdFilter.mockResolvedValue([
      { _id: KEY, type: "machine", metadata: { quickMeeting: false } },
    ])
    expect((await startQuickMeeting()).status).toBe(403)
    mockModel.users.getByIdFilter.mockResolvedValue([
      { _id: KEY, type: "machine", metadata: { quickMeeting: true } },
    ])
    expect(await startQuickMeeting()).toBeUndefined()
  })

  test("an external key needs transcription.live, a human nothing", async () => {
    entitle(ASYNC_ONLY)
    expect((await startQuickMeeting()).status).toBe(403)
    entitle(LIVE_ONLY)
    expect(await startQuickMeeting()).toBeUndefined()
    mockModel.users.getByIdFilter.mockResolvedValue([
      { _id: KEY, type: "user" },
    ])
    expect(await startQuickMeeting()).toBeUndefined()
  })
})

describe("the root a key answers to: its own organization", () => {
  const ROOT = "root"
  let records
  const record = (organizationId) => ({
    kind: "user",
    organizationId,
    provider: "meet:linagora",
    subject: "lemon-42",
    email: "alice@linagora.com",
    features: LIVE_ONLY,
  })

  beforeEach(() => {
    records = []
    mockModel.organizations.getById.mockImplementation(async (id) => [
      {
        _id: id,
        permissions: ALL_PERMISSIONS,
        users: [],
      },
    ])
    mockModel.externalEntitlements.findUser.mockImplementation(
      async (organizationId, { email }) =>
        records.filter(
          (r) => r.organizationId === organizationId && r.email === email,
        ),
    )
  })

  test("a record written under another organization opens nothing", async () => {
    mockModel.users.getByIdFilter.mockResolvedValue([
      externalKey({ organizationId: ROOT }),
    ])
    records.push(record("other"))
    expect((await gate(PERMISSIONS.SESSION)).code).toBe("no_entitlement")
    records.push(record(ROOT))
    expect(await gate(PERMISSIONS.SESSION)).toBeUndefined()
  })

  test("a key forged in another root never reads the real root", async () => {
    mockModel.users.getByIdFilter.mockResolvedValue([
      externalKey({ organizationId: "other" }),
    ])
    records.push(record(ROOT))
    expect((await gate(PERMISSIONS.SESSION)).code).toBe("no_entitlement")
  })

  test("a key with no organization has no root, hence no right", async () => {
    mockModel.users.getByIdFilter.mockResolvedValue([
      externalKey({ organizationId: undefined }),
    ])
    records.push(record(ROOT))
    expect((await gate(PERMISSIONS.SESSION)).code).toBe("no_entitlement")
  })
})
