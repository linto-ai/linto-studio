jest.mock("debug", () => () => () => {})
process.env.CM_JWT_SECRET = "test-cm-secret"
process.env.EXTERNAL_EXCHANGE_TOKEN_TTL = "1h"

const mockModel = {
  users: {
    createApiKey: jest.fn(),
    update: jest.fn(),
    findApiKeyByExternalIdentity: jest.fn(),
    findApiKeyOfPerson: jest.fn(),
  },
  organizations: {
    addMember: jest.fn(),
    getById: jest.fn(),
  },
  tokens: { insert: jest.fn(), getTokenByUser: jest.fn() },
  externalEntitlements: { findUser: jest.fn(), findDomain: jest.fn() },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)
const mockAddMember = mockModel.organizations.addMember
jest.mock(`${process.cwd()}/lib/logger/logger`, () => ({
  info() {},
  warn() {},
  error() {},
  debug() {},
  log() {},
}))

const jwt = require("jsonwebtoken")
const bridge = require(
  `${process.cwd()}/components/WebServer/controllers/apikey/exchange`,
)

const ROOT = "0123456789abcdef01234567"
const OTHER_ROOT = "1111111111111111aaaaaaaa"
const OTHER_ORG = "2222222222222222bbbbbbbb"
const KEY = "aaaaaaaaaaaaaaaaaaaaaaaa"
const WINNER = "dddddddddddddddddddddddd"
const CALLER = "cccccccccccccccccccccccc"
const BOTH = { transcription: { live: true, async: true } }
const future = () => new Date(Date.now() + 86400e3)

// Under the real root unless the test says otherwise
const exchangeExternalIdentity = (body, caller) =>
  bridge.exchangeExternalIdentity({ organizationId: ROOT, ...body }, caller)
const resolveExternalIdentity = (body, caller) =>
  bridge.resolveExternalIdentity({ organizationId: ROOT, ...body }, caller)

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
  features: BOTH,
  ...over,
})

beforeEach(() => {
  jest.clearAllMocks()
  mockModel.users.findApiKeyOfPerson.mockResolvedValue([])
  mockModel.users.findApiKeyByExternalIdentity.mockResolvedValue([])
  mockModel.tokens.getTokenByUser.mockResolvedValue([
    { salt: "keysalt", expiresAt: future() },
  ])
  mockModel.tokens.insert.mockResolvedValue({
    insertedId: "eeeeeeeeeeeeeeeeeeeeeeee",
  })
  mockModel.externalEntitlements.findUser.mockResolvedValue([])
  mockModel.externalEntitlements.findDomain.mockResolvedValue([])
  mockModel.organizations.getById.mockImplementation(async (id) =>
    [ROOT, OTHER_ROOT, OTHER_ORG].includes(id) ? [{ _id: id }] : [],
  )
  mockAddMember.mockResolvedValue({ matchedCount: 1 })
})

function entitleUser(features = BOTH) {
  mockModel.externalEntitlements.findUser.mockResolvedValue([
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
  test("answers the capabilities and the root organization", async () => {
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
      organizationId: ROOT,
      capabilities: {
        quickMeeting: true,
        transcription: { live: true, async: true },
      },
    })
    expect(mockModel.users.createApiKey).not.toHaveBeenCalled()
    expect(mockModel.tokens.insert).not.toHaveBeenCalled()
    expect(mockAddMember).not.toHaveBeenCalled()
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

  test("a database failure is a server error, never a missing entitlement", async () => {
    mockModel.externalEntitlements.findUser.mockRejectedValue(new Error("down"))
    await expect(
      resolveExternalIdentity({ provider: "twake", subject: "jdoe" }, CALLER),
    ).rejects.toThrow("down")
  })
})

describe("`recording: true` alone opens no LinTO right", () => {
  test("resolve answers it", async () => {
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
    await expect(
      exchangeExternalIdentity({ provider: "twake", subject: "jdoe" }, CALLER),
    ).rejects.toMatchObject({ status: 404, code: "no_entitlement" })
    expect(mockModel.users.createApiKey).not.toHaveBeenCalled()
    expect(mockModel.tokens.insert).not.toHaveBeenCalled()
    expect(mockAddMember).not.toHaveBeenCalled()
  })

  test("token comes with any LinTO-served feature next to it", async () => {
    entitleUser({ recording: true, summary: true })
    mockModel.users.findApiKeyOfPerson.mockResolvedValue([key()])
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
    mockModel.users.findApiKeyOfPerson.mockResolvedValue([key()])
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

  test("the key of the subject wins over a newer key found by email", async () => {
    entitleUser()
    mockModel.users.findApiKeyOfPerson.mockResolvedValue([
      key({
        _id: WINNER,
        metadata: {
          externalIdentity: {
            provider: "other",
            subject: "x",
            email: "jdoe@twake.app",
          },
          organizationId: ROOT,
        },
      }),
      key(),
    ])
    const out = await exchangeExternalIdentity(
      { provider: "twake", subject: "jdoe", email: "jdoe@twake.app" },
      CALLER,
    )
    expect(out.userId).toBe(KEY)
  })

  test("a key provisioned elsewhere for that email is that person's", async () => {
    entitleUser()
    mockModel.users.findApiKeyOfPerson.mockResolvedValue([
      key({
        metadata: {
          externalIdentity: {
            provider: "other",
            subject: "x",
            email: "jdoe@twake.app",
          },
          organizationId: ROOT,
        },
      }),
    ])
    const out = await exchangeExternalIdentity(
      { provider: "twake", subject: "jdoe", email: "jdoe@twake.app" },
      CALLER,
    )
    expect(out).toMatchObject({ userId: KEY, created: false })
    expect(mockModel.users.createApiKey).not.toHaveBeenCalled()
  })

  test("capabilities follow the entitlement, not the key", async () => {
    entitleUser({ transcription: { live: false, async: true } })
    mockModel.users.findApiKeyOfPerson.mockResolvedValue([key()])
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
    mockModel.users.findApiKeyOfPerson.mockResolvedValue([
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

  test("a hand-made key is used as is, its membership untouched", async () => {
    entitleUser()
    mockModel.users.findApiKeyOfPerson.mockResolvedValue([key()])
    const out = await exchangeExternalIdentity(
      { provider: "twake", subject: "jdoe", email: "jdoe@twake.app" },
      CALLER,
    )
    expect(out).toMatchObject({ created: false, userId: KEY })
    expect(mockModel.users.createApiKey).not.toHaveBeenCalled()
    expect(mockAddMember).not.toHaveBeenCalled()
  })

  test("403 revoked when the key has no token row left", async () => {
    entitleUser()
    mockModel.users.findApiKeyOfPerson.mockResolvedValue([key()])
    mockModel.tokens.getTokenByUser.mockResolvedValue([])
    await expect(
      exchangeExternalIdentity({ provider: "twake", subject: "jdoe" }, CALLER),
    ).rejects.toMatchObject({ status: 403, code: "revoked" })
    expect(mockModel.tokens.insert).not.toHaveBeenCalled()
  })

  test("403 expired, not revoked, when the key's tokens have all expired", async () => {
    entitleUser()
    mockModel.users.findApiKeyOfPerson.mockResolvedValue([key()])
    mockModel.tokens.getTokenByUser.mockResolvedValue([
      { salt: "old", expiresAt: new Date(Date.now() - 1000) },
    ])
    await expect(
      exchangeExternalIdentity({ provider: "twake", subject: "jdoe" }, CALLER),
    ).rejects.toMatchObject({ status: 403, code: "expired" })
    expect(mockModel.tokens.insert).not.toHaveBeenCalled()
  })

  test("a failed read of the key's tokens mints nothing", async () => {
    entitleUser()
    mockModel.users.findApiKeyOfPerson.mockResolvedValue([key()])
    mockModel.tokens.getTokenByUser.mockResolvedValue(new Error("down"))
    await expect(
      exchangeExternalIdentity({ provider: "twake", subject: "jdoe" }, CALLER),
    ).rejects.toThrow("down")
    expect(mockModel.tokens.insert).not.toHaveBeenCalled()
  })

  test("400 on an invalid request", async () => {
    for (const body of [
      { provider: "" },
      { provider: "x" },
      { provider: "x", email: "nope" },
    ]) {
      await expect(
        exchangeExternalIdentity(body, CALLER),
      ).rejects.toMatchObject({
        status: 400,
        code: "invalid_external_identity",
      })
    }
  })

  test("an empty email is no email", async () => {
    entitleUser()
    mockModel.users.findApiKeyOfPerson.mockResolvedValue([key()])
    const out = await exchangeExternalIdentity(
      { provider: "twake", subject: "jdoe", email: "" },
      CALLER,
    )
    expect(out.userId).toBe(KEY)
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
  })

  test("a member of a declared domain gets it in the root, role 4, identity only", async () => {
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
      createdBy: CALLER,
      organizationId: ROOT,
      justInTime: true,
    })
    expect(mockAddMember).toHaveBeenCalledWith(ROOT, KEY, 4, "machine")
    const kinds = mockModel.tokens.insert.mock.calls.map((c) => c[3]?.kind)
    expect(kinds).toEqual([undefined, "exchange"])
    expect(out).toMatchObject({
      created: true,
      userId: KEY,
      organizationId: ROOT,
      externalIdentity: {
        provider: "meet:linagora",
        subject: "lemon-42",
        email: "alice@linagora.com",
      },
      capabilities: { quickMeeting: true },
    })
  })

  test("only once: the second call reuses the key", async () => {
    const identity = {
      provider: "meet:linagora",
      subject: "lemon-42",
      email: "alice@linagora.com",
    }
    await exchangeExternalIdentity(identity, CALLER)
    expect(mockModel.users.createApiKey).toHaveBeenCalledTimes(1)

    mockModel.users.findApiKeyOfPerson.mockResolvedValue([
      key({
        metadata: { externalIdentity: identity, organizationId: ROOT },
      }),
    ])
    const second = await exchangeExternalIdentity(identity, CALLER)
    expect(second.created).toBe(false)
    expect(mockModel.users.createApiKey).toHaveBeenCalledTimes(1)
  })

  test("a concurrent exchange that created the key first gives its key, made a member first", async () => {
    const identity = {
      provider: "meet:linagora",
      subject: "lemon-42",
      email: "alice@linagora.com",
    }
    mockModel.users.createApiKey.mockResolvedValue({
      success: false,
      error: { code: 11000 },
    })
    mockModel.users.findApiKeyOfPerson
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        key({
          _id: WINNER,
          metadata: {
            externalIdentity: identity,
            organizationId: ROOT,
            justInTime: true,
          },
        }),
      ])
    // the winner may have neither its token nor its membership yet
    mockModel.tokens.getTokenByUser.mockResolvedValue([])
    const out = await exchangeExternalIdentity(identity, CALLER)
    expect(out).toMatchObject({
      userId: WINNER,
      created: false,
      organizationId: ROOT,
    })
    expect(mockAddMember).toHaveBeenCalledWith(ROOT, WINNER, 4, "machine")
    expect(mockAddMember.mock.invocationCallOrder[0]).toBeLessThan(
      mockModel.tokens.insert.mock.invocationCallOrder[0],
    )
    expect(mockModel.tokens.insert.mock.calls[0][0]).toBe(WINNER)
  })

  test("a failed membership mints nothing, and the next exchange completes it", async () => {
    const identity = {
      provider: "meet:linagora",
      subject: "lemon-42",
      email: "alice@linagora.com",
    }
    mockAddMember.mockResolvedValueOnce(new Error("down"))
    await expect(exchangeExternalIdentity(identity, CALLER)).rejects.toThrow(
      "down",
    )
    expect(mockModel.tokens.insert.mock.calls.map((c) => c[3]?.kind)).toEqual([
      undefined,
    ])

    mockModel.users.findApiKeyOfPerson.mockResolvedValue([
      key({
        metadata: {
          externalIdentity: identity,
          organizationId: ROOT,
          justInTime: true,
        },
      }),
    ])
    const out = await exchangeExternalIdentity(identity, CALLER)
    expect(out.created).toBe(false)
    expect(mockAddMember).toHaveBeenLastCalledWith(ROOT, KEY, 4, "machine")
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

  test("a subject alone gives a key without an email", async () => {
    entitleUser()
    await exchangeExternalIdentity(
      { provider: "twake", subject: "jdoe" },
      CALLER,
    )
    const created = mockModel.users.createApiKey.mock.calls[0][0]
    expect(created.metadata.externalIdentity).toEqual({
      provider: "twake",
      subject: "jdoe",
    })
  })
})

describe("one root organization", () => {
  // Another organization's admin may create keys and records at will: here
  // they claim the same person, by subject, by email and by domain
  const forged = {
    keys: [
      key({
        _id: WINNER,
        metadata: {
          externalIdentity: {
            provider: "twake",
            subject: "jdoe",
            email: "jdoe@linagora.com",
          },
          organizationId: OTHER_ORG,
          justInTime: true,
        },
      }),
    ],
    records: [
      {
        kind: "user",
        organizationId: OTHER_ROOT,
        provider: "twake",
        subject: "jdoe",
        email: "jdoe@linagora.com",
        features: BOTH,
      },
      domainRecord({ organizationId: OTHER_ROOT }),
    ],
  }
  let db

  beforeEach(() => {
    db = { keys: [...forged.keys], records: [...forged.records] }
    mockModel.externalEntitlements.findUser.mockImplementation(
      async (organizationId, { provider, subject, email }) =>
        db.records.filter(
          (r) =>
            r.kind === "user" &&
            r.organizationId === organizationId &&
            ((r.provider === provider && r.subject === subject) ||
              (email && r.email === email)),
        ),
    )
    mockModel.externalEntitlements.findDomain.mockImplementation(
      async (organizationId, domain) =>
        db.records.filter(
          (r) =>
            r.kind === "domain" &&
            r.organizationId === organizationId &&
            r.domain === domain,
        ),
    )
    mockModel.users.findApiKeyOfPerson.mockImplementation(
      async ({ provider, subject, email }, organizationId) =>
        db.keys.filter(
          (k) =>
            k.metadata.organizationId === organizationId &&
            ((k.metadata.externalIdentity.provider === provider &&
              k.metadata.externalIdentity.subject === subject) ||
              (email && k.metadata.externalIdentity.email === email)),
        ),
    )
    mockModel.users.createApiKey.mockResolvedValue({
      insertedCount: 1,
      insertedId: KEY,
    })
    mockModel.users.update.mockResolvedValue({ matchedCount: 1 })
  })

  const person = {
    provider: "twake",
    subject: "jdoe",
    email: "jdoe@linagora.com",
  }

  test("records of another root neither resolve nor exchange", async () => {
    await expect(resolveExternalIdentity(person, CALLER)).rejects.toMatchObject(
      { status: 404, code: "no_entitlement" },
    )
    await expect(
      exchangeExternalIdentity(person, CALLER),
    ).rejects.toMatchObject({ status: 404, code: "no_entitlement" })
    expect(mockModel.tokens.insert).not.toHaveBeenCalled()
  })

  test("the real root's record wins, and a forged key is never minted", async () => {
    db.records.push(domainRecord({ features: { summary: true } }))
    const out = await exchangeExternalIdentity(person, CALLER)
    expect(out).toMatchObject({
      created: true,
      userId: KEY,
      organizationId: ROOT,
      capabilities: { summary: true, transcription: { live: false } },
    })
    expect(mockModel.tokens.insert.mock.calls.map((c) => c[0])).not.toContain(
      WINNER,
    )
    expect(mockModel.users.findApiKeyOfPerson).toHaveBeenCalledWith(
      expect.anything(),
      ROOT,
    )
  })

  test("the other root gets its own answer, never the real root's", async () => {
    db.records.push(domainRecord({ features: { summary: true } }))
    const out = await bridge.resolveExternalIdentity(
      { organizationId: OTHER_ROOT, ...person },
      CALLER,
    )
    expect(out).toEqual({
      organizationId: OTHER_ROOT,
      capabilities: {
        quickMeeting: true,
        transcription: { live: true, async: true },
      },
    })
  })

  test("the root is required and must exist", async () => {
    for (const organizationId of [undefined, "", "nope", 42]) {
      await expect(
        bridge.exchangeExternalIdentity({ organizationId, ...person }, CALLER),
      ).rejects.toMatchObject({
        status: 400,
        code: "invalid_external_identity",
      })
    }
    await expect(
      bridge.resolveExternalIdentity(
        { organizationId: "ffffffffffffffffffffffff", ...person },
        CALLER,
      ),
    ).rejects.toMatchObject({ status: 404 })
    expect(mockModel.externalEntitlements.findUser).not.toHaveBeenCalled()
  })
})
