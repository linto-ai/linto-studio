/**
 * Identity bridge — POST /api/auth/external/{resolve,token}
 * (VISIO-USER-API-KEY-AUTH-ANALYSIS.md §4.3 [B3]):
 *
 *   resolve  entitlement → capabilities, with NO side effect (no key, no
 *            token, no organization)
 *   token    same resolution, then the key standing for that person — created
 *            just-in-time in the organization the resolution yields — and a
 *            short token of it
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
  externalEntitlements: {
    findUserBySubject: jest.fn(),
    findUserByEmail: jest.fn(),
    findDomain: jest.fn(),
    constructor: {
      KIND_USER: "user",
      KIND_DOMAIN: "domain",
      hasActiveFeature: (f) =>
        !!f &&
        typeof f === "object" &&
        Object.values(f).some((v) =>
          v === true
            ? true
            : v && typeof v === "object"
              ? mockModel.externalEntitlements.constructor.hasActiveFeature(v)
              : false,
        ),
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
const { exchangeExternalIdentity, resolveExternalIdentity } = require(
  `${process.cwd()}/components/WebServer/controllers/apikey/exchange`,
)

const ROOT = "0123456789abcdef01234567"
const DOMAIN_ORG = "fedcba9876543210fedcba98"
const KEY = "aaaaaaaaaaaaaaaaaaaaaaaa"
const CALLER = "cccccccccccccccccccccccc"
const BOTH = { transcription: { live: true, async: true } }
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
      organizationId: ROOT,
    },
    ...over,
  }
}

const domainRecord = (over = {}) => ({
  _id: "d",
  kind: "domain",
  organizationId: ROOT,
  provider: "external",
  domain: "linagora.com",
  domainOrganizationId: DOMAIN_ORG,
  features: BOTH,
  ...over,
})

beforeEach(() => {
  jest.clearAllMocks()
  mockModel.users.findApiKeyByExternalIdentity.mockResolvedValue([])
  mockModel.users.findApiKeyByExternalEmail.mockResolvedValue([])
  mockModel.tokens.getTokenByUser.mockResolvedValue([
    { salt: "keysalt", expiresAt: future() },
  ])
  mockModel.tokens.insert.mockResolvedValue({
    insertedId: "eeeeeeeeeeeeeeeeeeeeeeee",
  })
  mockModel.externalEntitlements.findUserBySubject.mockResolvedValue([])
  mockModel.externalEntitlements.findUserByEmail.mockResolvedValue([])
  mockModel.externalEntitlements.findDomain.mockResolvedValue([])
})

function entitleUser(features = BOTH) {
  mockModel.externalEntitlements.findUserBySubject.mockResolvedValue([
    {
      _id: "u",
      kind: "user",
      organizationId: ROOT,
      provider: "twake",
      email: "jdoe@twake.app",
      subject: "jdoe",
      features,
    },
  ])
}

describe("resolve has no side effect", () => {
  test("answers the capabilities and the target organization", async () => {
    mockModel.externalEntitlements.findDomain.mockResolvedValue([
      domainRecord(),
    ])
    const out = await resolveExternalIdentity(
      {
        provider: "meet:linagora",
        subject: "lemon-42",
        email: "Alice@Linagora.com",
      },
      CALLER,
    )
    expect(out).toEqual({
      organizationId: DOMAIN_ORG,
      capabilities: {
        quickMeeting: true,
        transcription: { live: true, async: true },
      },
    })
    // nothing was provisioned: no key, no token, no membership
    expect(mockModel.users.createApiKey).not.toHaveBeenCalled()
    expect(mockModel.tokens.insert).not.toHaveBeenCalled()
    expect(mockAddM2m).not.toHaveBeenCalled()
  })

  test("404 no_entitlement when nothing stands for the identity", async () => {
    await expect(
      resolveExternalIdentity(
        { provider: "meet:linagora", email: "nobody@nowhere.fr" },
        CALLER,
      ),
    ).rejects.toMatchObject({ status: 404, code: "no_entitlement" })
  })

  test("404 no_entitlement once every feature is off", async () => {
    entitleUser({ transcription: { live: false, async: false } })
    await expect(
      resolveExternalIdentity({ provider: "twake", subject: "jdoe" }, CALLER),
    ).rejects.toMatchObject({ status: 404, code: "no_entitlement" })
  })
})

describe("[P13] `recording: true` alone opens no LinTO right", () => {
  test("resolve still answers it (Meet gates the video recording on it)", async () => {
    entitleUser({ recording: true })
    const out = await resolveExternalIdentity(
      { provider: "twake", subject: "jdoe" },
      CALLER,
    )
    expect(out.capabilities).toEqual({
      recording: true,
      quickMeeting: false,
      transcription: { live: false, async: false },
    })
    expect(mockModel.users.createApiKey).not.toHaveBeenCalled()
  })

  test("token is 404 no_entitlement: no key is born, nothing is minted", async () => {
    entitleUser({ recording: true })
    mockModel.users.createApiKey.mockResolvedValue({ user_id: KEY })
    await expect(
      exchangeExternalIdentity({ provider: "twake", subject: "jdoe" }, CALLER),
    ).rejects.toMatchObject({ status: 404, code: "no_entitlement" })
    expect(mockModel.users.createApiKey).not.toHaveBeenCalled()
    expect(mockModel.tokens.insert).not.toHaveBeenCalled()
    expect(mockAddM2m).not.toHaveBeenCalled()
  })

  test("token comes with any LinTO-served feature next to it", async () => {
    entitleUser({ recording: true, summary: true })
    mockModel.users.findApiKeyByExternalIdentity.mockResolvedValue([key()])
    const out = await exchangeExternalIdentity(
      { provider: "twake", subject: "jdoe" },
      CALLER,
    )
    expect(out.token).toBeDefined()
    expect(out.capabilities).toMatchObject({ recording: true, summary: true })
  })
})

describe("token for an existing key", () => {
  test("mints a 1h token verifiable with the exchange row's salt", async () => {
    entitleUser()
    mockModel.users.findApiKeyByExternalIdentity.mockResolvedValue([key()])
    const before = Math.floor(Date.now() / 1000)
    const out = await exchangeExternalIdentity(
      { provider: "twake", subject: "jdoe", email: "JDoe@twake.app" },
      CALLER,
    )
    const [userId, salt, expiresIn, extra] =
      mockModel.tokens.insert.mock.calls[0]
    expect(userId).toBe(KEY)
    expect(expiresIn).toBe(3600e3)
    expect(extra).toEqual({
      kind: "exchange",
      provider: "twake",
      mintedBy: CALLER,
    })
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
      organizationId: ROOT,
      capabilities: {
        quickMeeting: true,
        transcription: { live: true, async: true },
      },
      externalIdentity: { provider: "twake", subject: "jdoe" },
      created: false,
    })
    expect(Object.keys(out)).not.toContain("salt")
    expect(mockModel.users.createApiKey).not.toHaveBeenCalled()
  })

  test("capabilities follow the entitlement, not the key", async () => {
    entitleUser({ transcription: { live: false, async: true } })
    mockModel.users.findApiKeyByExternalIdentity.mockResolvedValue([key()])
    const out = await exchangeExternalIdentity(
      { provider: "twake", subject: "jdoe" },
      CALLER,
    )
    expect(out.capabilities).toEqual({
      quickMeeting: false,
      transcription: { live: false, async: true },
    })
  })

  test("a key barred from quick meetings stays barred", async () => {
    entitleUser()
    mockModel.users.findApiKeyByExternalIdentity.mockResolvedValue([
      key({
        metadata: {
          externalIdentity: { provider: "twake", subject: "jdoe" },
          quickMeeting: false,
          organizationId: ROOT,
        },
      }),
    ])
    const out = await exchangeExternalIdentity(
      { provider: "twake", subject: "jdoe" },
      CALLER,
    )
    expect(out.capabilities.quickMeeting).toBe(false)
  })

  test("403 revoked when the key has no valid token row left", async () => {
    entitleUser()
    mockModel.users.findApiKeyByExternalIdentity.mockResolvedValue([key()])
    mockModel.tokens.getTokenByUser.mockResolvedValue([
      { salt: "old", expiresAt: new Date(Date.now() - 1000) },
    ])
    await expect(
      exchangeExternalIdentity({ provider: "twake", subject: "jdoe" }, CALLER),
    ).rejects.toMatchObject({ status: 403, code: "revoked" })
    expect(mockModel.tokens.insert).not.toHaveBeenCalled()
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

describe("just-in-time key", () => {
  beforeEach(() => {
    mockModel.externalEntitlements.findDomain.mockResolvedValue([
      domainRecord(),
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
            subject: "lemon-42",
            email: "alice@linagora.com",
          },
          quickMeeting: true,
          organizationId: DOMAIN_ORG,
        },
      }),
    ])
  })

  test("is created in the organization of the domain, role 4, identity only", async () => {
    const out = await exchangeExternalIdentity(
      {
        provider: "meet:linagora",
        subject: "lemon-42",
        email: "Alice@Linagora.com",
      },
      CALLER,
    )
    const created = mockModel.users.createApiKey.mock.calls[0][0]
    expect(created.firstname).toBe("meet:linagora:lemon-42")
    expect(created.metadata).toEqual({
      externalIdentity: {
        provider: "meet:linagora",
        subject: "lemon-42",
        email: "alice@linagora.com",
      },
      quickMeeting: true,
      createdBy: CALLER,
      organizationId: DOMAIN_ORG,
    })
    // the rights are NOT on the key: no plan, no features
    expect(created.metadata.plan).toBeUndefined()
    expect(created.metadata.features).toBeUndefined()
    expect(mockAddM2m).toHaveBeenCalledWith(DOMAIN_ORG, KEY, 4)
    // the key's own row (3650d) then the exchange row (1h)
    const kinds = mockModel.tokens.insert.mock.calls.map((c) => c[3]?.kind)
    expect(kinds).toEqual([undefined, "exchange"])
    expect(out).toMatchObject({
      created: true,
      userId: KEY,
      organizationId: DOMAIN_ORG,
    })
  })

  test("only once: the second call reuses the key", async () => {
    await exchangeExternalIdentity(
      {
        provider: "meet:linagora",
        subject: "lemon-42",
        email: "alice@linagora.com",
      },
      CALLER,
    )
    expect(mockModel.users.createApiKey).toHaveBeenCalledTimes(1)

    mockModel.users.findApiKeyByExternalIdentity.mockResolvedValue([
      key({ metadata: { ...key().metadata, organizationId: DOMAIN_ORG } }),
    ])
    const second = await exchangeExternalIdentity(
      {
        provider: "meet:linagora",
        subject: "lemon-42",
        email: "alice@linagora.com",
      },
      CALLER,
    )
    expect(second.created).toBe(false)
    expect(mockModel.users.createApiKey).toHaveBeenCalledTimes(1)
  })

  test("no key is created while every feature is off", async () => {
    mockModel.externalEntitlements.findDomain.mockResolvedValue([
      domainRecord({ features: {} }),
    ])
    await expect(
      exchangeExternalIdentity(
        { provider: "meet:linagora", email: "alice@linagora.com" },
        CALLER,
      ),
    ).rejects.toMatchObject({ status: 404, code: "no_entitlement" })
    expect(mockModel.users.createApiKey).not.toHaveBeenCalled()
  })

  test("uses the email as subject when none is given", async () => {
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
