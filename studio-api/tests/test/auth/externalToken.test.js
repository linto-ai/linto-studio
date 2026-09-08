/**
 * Identity bridge — POST /api/auth/external/token
 * (VISIO-USER-API-KEY-AUTH-ANALYSIS.md §4.3 [B3]):
 *
 *   external identity {provider, subject?, email?} → short token of the API
 *   key standing for it; lookup by (provider, subject), then by email;
 *   just-in-time key when the email's domain is active in an organization's
 *   external domains; 404 no_linked_key / 403 revoked otherwise.
 *
 * The minting is NOT mocked: the token is produced by the real generator and
 * verified here with the salt + CM_JWT_SECRET, exactly as the auth middleware
 * would. Mongo and the organization membership write are mocked.
 */
jest.mock("debug", () => () => () => {})
process.env.CM_JWT_SECRET = "test-cm-secret"
process.env.EXTERNAL_EXCHANGE_TOKEN_TTL = "1h"

const mockModel = {
  users: {
    getById: jest.fn(),
    createApiKey: jest.fn(),
    update: jest.fn(),
    findApiKeyByExternalIdentity: jest.fn(),
    findApiKeyByExternalEmail: jest.fn(),
  },
  tokens: { insert: jest.fn(), getTokenByUser: jest.fn() },
  externalDomains: {
    getByDomain: jest.fn(),
    get: jest.fn(),
    constructor: {
      isActive: (d) => !!d && d.paying === true && d.ai?.transcription === true,
    },
  },
}
mockModel.tokens.constructor = { KIND_EXCHANGE: "exchange" }
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)
const mockAddM2m = jest.fn()
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/organization/utility`,
  () => ({ addM2mUserToOrganization: (...a) => mockAddM2m(...a) }),
)
jest.mock(`${process.cwd()}/lib/logger/logger`, () => ({
  info() {},
  warn() {},
  error() {},
  debug() {},
  log() {},
}))

const jwt = require("jsonwebtoken")
const { exchangeExternalIdentity } = require(
  `${process.cwd()}/components/WebServer/controllers/apikey/exchange`,
)

const ORG = "0123456789abcdef01234567"
const KEY = "aaaaaaaaaaaaaaaaaaaaaaaa"
const CALLER = "cccccccccccccccccccccccc"
const future = () => new Date(Date.now() + 86400e3)

function key(over = {}) {
  return {
    _id: KEY,
    type: "machine",
    role: 0,
    metadata: {
      externalIdentity: {
        provider: "twake",
        subject: "jdoe",
        email: "jdoe@twake.app",
      },
      quickMeeting: true,
      organizationId: ORG,
    },
    ...over,
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  mockModel.users.findApiKeyByExternalIdentity.mockResolvedValue([])
  mockModel.users.findApiKeyByExternalEmail.mockResolvedValue([])
  mockModel.tokens.getTokenByUser.mockResolvedValue([
    { salt: "keysalt", expiresAt: future() },
  ])
  mockModel.tokens.insert.mockImplementation(
    async (userId, salt, expiresIn, extra) => ({
      insertedId: "eeeeeeeeeeeeeeeeeeeeeeee",
    }),
  )
  mockModel.externalDomains.getByDomain.mockResolvedValue([])
  mockModel.externalDomains.get.mockResolvedValue([])
})

describe("exchange for a linked key", () => {
  test("mints a 1h token verifiable with the exchange row's salt", async () => {
    mockModel.users.findApiKeyByExternalIdentity.mockResolvedValue([key()])
    const before = Math.floor(Date.now() / 1000)
    const out = await exchangeExternalIdentity(
      { provider: "twake", subject: "jdoe", email: "JDoe@twake.app" },
      CALLER,
    )
    expect(mockModel.users.findApiKeyByExternalIdentity).toHaveBeenCalledWith({
      provider: "twake",
      subject: "jdoe",
    })
    // the exchange row: dedicated kind, the key's user, the caller
    const [userId, salt, expiresIn, extra] =
      mockModel.tokens.insert.mock.calls[0]
    expect(userId).toBe(KEY)
    expect(expiresIn).toBe(3600e3)
    expect(extra).toEqual({
      kind: "exchange",
      provider: "twake",
      mintedBy: CALLER,
    })
    // the JWT is bound to that row (salt + secret) and expires in 1h
    const decoded = jwt.verify(out.token, salt + process.env.CM_JWT_SECRET)
    expect(decoded.data).toEqual({
      tokenId: "eeeeeeeeeeeeeeeeeeeeeeee",
      userId: KEY,
      role: 0,
    })
    expect(decoded.exp - decoded.iat).toBe(3600)
    expect(decoded.iat).toBeGreaterThanOrEqual(before)
    expect(out).toMatchObject({
      expiresIn: 3600,
      userId: KEY,
      organizationId: ORG,
      capabilities: { quickMeeting: true },
      externalIdentity: { provider: "twake", subject: "jdoe" },
      created: false,
    })
    expect(Object.keys(out)).not.toContain("salt")
  })

  test("falls back to the email (any provider) when (provider, subject) is unknown", async () => {
    mockModel.users.findApiKeyByExternalEmail.mockResolvedValue([key()])
    const out = await exchangeExternalIdentity(
      {
        provider: "meet:linagora",
        subject: "lemon-sub-42",
        email: "JDOE@twake.app",
      },
      CALLER,
    )
    expect(mockModel.users.findApiKeyByExternalEmail).toHaveBeenCalledWith({
      email: "jdoe@twake.app",
    })
    expect(out.userId).toBe(KEY)
    expect(mockModel.users.createApiKey).not.toHaveBeenCalled()
  })

  test("reports quickMeeting=false from the key's metadata", async () => {
    mockModel.users.findApiKeyByExternalIdentity.mockResolvedValue([
      key({
        metadata: {
          externalIdentity: { provider: "twake", subject: "jdoe" },
          quickMeeting: false,
          organizationId: ORG,
        },
      }),
    ])
    const out = await exchangeExternalIdentity(
      { provider: "twake", subject: "jdoe" },
      CALLER,
    )
    expect(out.capabilities).toEqual({ quickMeeting: false })
  })

  test("403 revoked when the key has no valid token row left", async () => {
    mockModel.users.findApiKeyByExternalIdentity.mockResolvedValue([key()])
    mockModel.tokens.getTokenByUser.mockResolvedValue([
      { salt: "old", expiresAt: new Date(Date.now() - 1000) },
    ])
    await expect(
      exchangeExternalIdentity({ provider: "twake", subject: "jdoe" }, CALLER),
    ).rejects.toMatchObject({
      status: 403,
      code: "revoked",
    })
    expect(mockModel.tokens.insert).not.toHaveBeenCalled()
  })
})

describe("just-in-time keys follow their domain", () => {
  const jitKey = () =>
    key({
      metadata: {
        externalIdentity: {
          provider: "meet:linagora",
          subject: "s",
          email: "alice@linagora.com",
        },
        quickMeeting: true,
        organizationId: ORG,
        plan: { source: "domain", domain: "linagora.com", plan: "p1" },
      },
    })

  test("mints while the domain is active", async () => {
    mockModel.users.findApiKeyByExternalIdentity.mockResolvedValue([jitKey()])
    mockModel.externalDomains.get.mockResolvedValue([
      {
        organizationId: ORG,
        domain: "linagora.com",
        paying: true,
        ai: { transcription: true },
      },
    ])
    const out = await exchangeExternalIdentity(
      { provider: "meet:linagora", subject: "s" },
      CALLER,
    )
    expect(out.userId).toBe(KEY)
    expect(mockModel.externalDomains.get).toHaveBeenCalledWith(
      ORG,
      "linagora.com",
    )
  })

  test("403 domain_inactive once the domain stops paying (no fan-out revocation needed)", async () => {
    mockModel.users.findApiKeyByExternalIdentity.mockResolvedValue([jitKey()])
    mockModel.externalDomains.get.mockResolvedValue([
      {
        organizationId: ORG,
        domain: "linagora.com",
        paying: false,
        ai: { transcription: true },
      },
    ])
    await expect(
      exchangeExternalIdentity(
        { provider: "meet:linagora", subject: "s" },
        CALLER,
      ),
    ).rejects.toMatchObject({ status: 403, code: "domain_inactive" })
    expect(mockModel.tokens.insert).not.toHaveBeenCalled()
  })

  test("a per-person key (no domain plan) is not tied to any domain", async () => {
    mockModel.users.findApiKeyByExternalIdentity.mockResolvedValue([key()])
    await exchangeExternalIdentity(
      { provider: "twake", subject: "jdoe" },
      CALLER,
    )
    expect(mockModel.externalDomains.get).not.toHaveBeenCalled()
  })
})

describe("no linked key", () => {
  test("404 no_linked_key when nothing matches and the domain is not active", async () => {
    mockModel.externalDomains.getByDomain.mockResolvedValue([
      {
        organizationId: ORG,
        domain: "linagora.com",
        paying: true,
        ai: { transcription: false },
      },
    ])
    await expect(
      exchangeExternalIdentity(
        { provider: "meet:linagora", subject: "s", email: "x@linagora.com" },
        CALLER,
      ),
    ).rejects.toMatchObject({ status: 404, code: "no_linked_key" })
    expect(mockModel.users.createApiKey).not.toHaveBeenCalled()
  })

  test("400 on an invalid request", async () => {
    await expect(
      exchangeExternalIdentity({ provider: "" }, CALLER),
    ).rejects.toMatchObject({ status: 400 })
    await expect(
      exchangeExternalIdentity({ provider: "x" }, CALLER),
    ).rejects.toMatchObject({ status: 400 })
    await expect(
      exchangeExternalIdentity({ provider: "x", email: "nope" }, CALLER),
    ).rejects.toMatchObject({ status: 400 })
  })
})

describe("just-in-time key for an active domain", () => {
  beforeEach(() => {
    mockModel.externalDomains.getByDomain.mockResolvedValue([
      {
        organizationId: ORG,
        domain: "linagora.com",
        paying: true,
        ai: { transcription: true, liveMinutesPerMonth: -1 },
        plan: "p1",
      },
    ])
    mockModel.users.createApiKey.mockResolvedValue({
      insertedCount: 1,
      insertedId: KEY,
    })
    mockModel.users.update.mockResolvedValue({ matchedCount: 1 })
    // generateApiKeyToken reads the fresh user, then the exchange re-reads it
    mockModel.users.getById.mockResolvedValue([
      key({
        metadata: {
          externalIdentity: {
            provider: "meet:linagora",
            subject: "lemon-sub-42",
            email: "alice@linagora.com",
          },
          quickMeeting: true,
          organizationId: ORG,
        },
      }),
    ])
  })

  test("creates the key in the domain's organization, role 4, then mints", async () => {
    const out = await exchangeExternalIdentity(
      {
        provider: "meet:linagora",
        subject: "lemon-sub-42",
        email: "Alice@Linagora.com",
      },
      CALLER,
    )
    expect(mockModel.externalDomains.getByDomain).toHaveBeenCalledWith(
      "linagora.com",
    )
    const created = mockModel.users.createApiKey.mock.calls[0][0]
    expect(created.firstname).toBe("meet:linagora:lemon-sub-42")
    expect(created.metadata).toMatchObject({
      externalIdentity: {
        provider: "meet:linagora",
        subject: "lemon-sub-42",
        email: "alice@linagora.com",
      },
      quickMeeting: true,
      plan: { source: "domain", domain: "linagora.com", plan: "p1" },
      createdBy: CALLER,
      organizationId: ORG,
    })
    expect(mockAddM2m).toHaveBeenCalledWith(ORG, KEY, 4)
    // the key's own row (3650d) then the exchange row (1h)
    const kinds = mockModel.tokens.insert.mock.calls.map((c) => c[3]?.kind)
    expect(kinds).toEqual([undefined, "exchange"])
    expect(out).toMatchObject({
      created: true,
      userId: KEY,
      organizationId: ORG,
      capabilities: { quickMeeting: true },
    })
  })

  test("uses the email as subject when none is given (Twake B2B members)", async () => {
    await exchangeExternalIdentity(
      { provider: "twake", email: "bob@linagora.com" },
      CALLER,
    )
    const created = mockModel.users.createApiKey.mock.calls[0][0]
    expect(created.metadata.externalIdentity).toEqual({
      provider: "twake",
      subject: "bob@linagora.com",
      email: "bob@linagora.com",
    })
  })
})
