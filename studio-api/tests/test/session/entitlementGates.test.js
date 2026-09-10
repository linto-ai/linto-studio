/**
 * Server gates (VISIO-USER-API-KEY-AUTH-ANALYSIS.md §4.3 [B3], §6 ter C1): a
 * call made by a key that stands for an external identity re-reads that
 * identity's entitlement, EVERY time.
 *
 *   POST quickMeeting, POST bots   → transcription.live
 *   POST conversations/create      → transcription.async
 *
 * So a revocation bites at once, even with a short token still valid — and a
 * key with no external identity (the historical use) is never affected.
 */
jest.mock("debug", () => () => () => {})
process.env.SESSION_API_ENDPOINT = "http://sessionapi:8005/v1"
process.env.SESSION_PSW_SALT = "salt"
process.env.CM_JWT_SECRET = "test-cm-secret"

const mockModel = {
  users: { getById: jest.fn() },
  externalEntitlements: {
    findUserBySubject: jest.fn(),
    findUserByEmail: jest.fn(),
    findDomain: jest.fn(),
    constructor: { KIND_USER: "user", KIND_DOMAIN: "domain" },
  },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)
const mockAxios = { get: jest.fn(), post: jest.fn() }
jest.mock(`${process.cwd()}/lib/utility/axios`, () => mockAxios)
jest.mock(`${process.cwd()}/lib/logger/logger`, () => ({
  info() {},
  warn() {},
  error() {},
  debug() {},
}))

const { assertExternalFeature, requireExternalFeature } = require(
  `${process.cwd()}/components/WebServer/middlewares/access/entitlement`,
)
const { createQuickMeeting, createBot } = require(
  `${process.cwd()}/components/WebServer/controllers/session/session`,
)

const KEY = "k1"
const LIVE_ONLY = { transcription: { live: true, async: false } }
const ASYNC_ONLY = { transcription: { live: false, async: true } }

function externalKey(over = {}) {
  return {
    _id: KEY,
    type: "machine",
    metadata: {
      externalIdentity: {
        provider: "meet:linagora",
        subject: "lemon-42",
        email: "alice@linagora.com",
      },
      quickMeeting: true,
    },
    ...over,
  }
}

function entitle(features) {
  mockModel.externalEntitlements.findUserBySubject.mockResolvedValue([
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

function req() {
  return {
    payload: { data: { userId: KEY } },
    params: { organizationId: "org" },
    body: { channels: [{}] },
    query: {},
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  mockAxios.get.mockResolvedValue({ totalItems: 0 })
  mockModel.externalEntitlements.findUserBySubject.mockResolvedValue([])
  mockModel.externalEntitlements.findUserByEmail.mockResolvedValue([])
  mockModel.externalEntitlements.findDomain.mockResolvedValue([])
})

describe("quick meeting", () => {
  test("goes through while transcription.live is on", async () => {
    mockModel.users.getById.mockResolvedValue([externalKey()])
    entitle(LIVE_ONLY)
    const r = req()
    const next = jest.fn()
    await createQuickMeeting(r, next)
    expect(next).toHaveBeenCalledWith()
    expect(r.body.name).toBe("@k1")
  })

  test("403 as soon as the entitlement is taken away, before any call out", async () => {
    mockModel.users.getById.mockResolvedValue([externalKey()])
    entitle({ transcription: { live: false, async: true } })
    const next = jest.fn()
    await createQuickMeeting(req(), next)
    const err = next.mock.calls[0][0]
    expect(err.status).toBe(403)
    expect(err.code).toBe("no_entitlement")
    expect(err.feature).toBe("transcription.live")
    expect(mockAxios.get).not.toHaveBeenCalled()
  })

  test("403 when the entitlement record is gone altogether", async () => {
    mockModel.users.getById.mockResolvedValue([externalKey()])
    const next = jest.fn()
    await createQuickMeeting(req(), next)
    expect(next.mock.calls[0][0].status).toBe(403)
  })

  test("a key with no external identity is unaffected", async () => {
    mockModel.users.getById.mockResolvedValue([
      { _id: KEY, type: "machine", metadata: { quickMeeting: true } },
    ])
    const next = jest.fn()
    await createQuickMeeting(req(), next)
    expect(next).toHaveBeenCalledWith()
    expect(
      mockModel.externalEntitlements.findUserBySubject,
    ).not.toHaveBeenCalled()
  })

  test("a human is unaffected", async () => {
    mockModel.users.getById.mockResolvedValue([{ _id: KEY, type: "user" }])
    const next = jest.fn()
    await createQuickMeeting(req(), next)
    expect(next).toHaveBeenCalledWith()
  })

  test("the quickMeeting flag of the key still applies on top", async () => {
    mockModel.users.getById.mockResolvedValue([
      externalKey({
        metadata: {
          externalIdentity: {
            provider: "meet:linagora",
            subject: "lemon-42",
            email: "alice@linagora.com",
          },
          quickMeeting: false,
        },
      }),
    ])
    entitle(LIVE_ONLY)
    const next = jest.fn()
    await createQuickMeeting(req(), next)
    expect(next.mock.calls[0][0].code).toBe("quick_meeting_disabled")
  })
})

describe("bot", () => {
  test("live entitlement is required to launch a bot", async () => {
    mockModel.users.getById.mockResolvedValue([externalKey()])
    entitle(LIVE_ONLY)
    const ok = jest.fn()
    await createBot(req(), ok)
    expect(ok).toHaveBeenCalledWith()

    entitle(ASYNC_ONLY)
    const refused = jest.fn()
    await createBot(req(), refused)
    expect(refused.mock.calls[0][0].status).toBe(403)
  })
})

describe("upload for transcription", () => {
  test("async entitlement is required, as a route middleware", async () => {
    mockModel.users.getById.mockResolvedValue([externalKey()])
    const middleware = requireExternalFeature("transcription.async")

    entitle(ASYNC_ONLY)
    const ok = jest.fn()
    await middleware({ payload: { data: { userId: KEY } } }, {}, ok)
    expect(ok).toHaveBeenCalledWith()

    entitle(LIVE_ONLY)
    const refused = jest.fn()
    await middleware({ payload: { data: { userId: KEY } } }, {}, refused)
    expect(refused.mock.calls[0][0].status).toBe(403)
    expect(refused.mock.calls[0][0].feature).toBe("transcription.async")
  })

  test("a domain entitlement serves its members", async () => {
    mockModel.users.getById.mockResolvedValue([externalKey()])
    mockModel.externalEntitlements.findDomain.mockResolvedValue([
      {
        _id: "d",
        kind: "domain",
        organizationId: "root",
        domain: "linagora.com",
        domainOrganizationId: "domainOrg",
        features: ASYNC_ONLY,
      },
    ])
    await expect(
      assertExternalFeature(KEY, "transcription.async"),
    ).resolves.toBeUndefined()
    await expect(
      assertExternalFeature(KEY, "transcription.live"),
    ).rejects.toMatchObject({ status: 403 })
  })
})
