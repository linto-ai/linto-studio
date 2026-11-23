jest.mock("debug", () => () => () => {})
process.env.CM_JWT_SECRET = "test-cm-secret"

// Entitlements, keys and tokens in memory
const mockDb = { records: new Map(), keys: [], tokens: [] }
const ROOT = "0123456789abcdef01234567"
const mockRoot = ROOT
const mockRecordKey = (key) =>
  JSON.stringify([key.organizationId, key.provider, key.email])
const mockOwnTokens = (userId) =>
  mockDb.tokens.filter((t) => t.userId === userId && t.kind !== "exchange")

const mockModel = {
  externalEntitlements: {
    upsertUnlessNewer: jest.fn(async (key, values, onInsert) => {
      const stored = mockDb.records.get(mockRecordKey(key))
      mockDb.records.set(mockRecordKey(key), {
        ...(stored || { ...key, ...onInsert }),
        ...values,
        updatedAt: values.updatedAt || new Date(),
      })
      return true
    }),
    getUser: jest.fn(async (organizationId, provider, email) => {
      const record = mockDb.records.get(
        mockRecordKey({ organizationId, provider, email }),
      )
      return record ? [record] : []
    }),
    findUser: jest.fn(async (organizationId, { email }) =>
      [...mockDb.records.values()].filter(
        (r) => r.organizationId === organizationId && r.email === email,
      ),
    ),
    findDomain: jest.fn(async () => []),
  },
  users: {
    findApiKeyOfPerson: jest.fn(async ({ email }, organizationId) =>
      mockDb.keys.filter(
        (k) =>
          k.metadata.organizationId === organizationId &&
          k.metadata.externalIdentity.email === email,
      ),
    ),
    findApiKeyByExternalIdentity: jest.fn(async () => []),
    createApiKey: jest.fn(async (payload, role) => {
      const _id = `key${mockDb.keys.length + 1}`.padEnd(24, "0")
      mockDb.keys.push({ _id, type: "machine", role, ...payload })
      return { insertedCount: 1, insertedId: _id }
    }),
    update: jest.fn(async () => ({ matchedCount: 1 })),
    getByIdFilter: jest.fn(async (id) =>
      mockDb.keys.filter((k) => k._id === id),
    ),
    listApiKeyList: jest.fn(async ([id]) =>
      mockDb.keys.filter((k) => k._id === id),
    ),
  },
  tokens: {
    insert: jest.fn(async (userId, salt, expiresIn, extra) => {
      const row = {
        _id: `tok${mockDb.tokens.length}`,
        userId: userId.toString(),
        salt,
        expiresAt: new Date(Date.now() + expiresIn),
        ...extra,
      }
      mockDb.tokens.push(row)
      return { insertedId: row._id }
    }),
    getTokenByUser: jest.fn(async (userId) => mockOwnTokens(userId)),
    deleteAllUserTokens: jest.fn(async (userId) => {
      mockDb.tokens = mockDb.tokens.filter((t) => t.userId !== userId)
    }),
  },
  organizations: {
    addMember: jest.fn(async () => ({ matchedCount: 1 })),
    getByExternalDomain: jest.fn(async () => []),
    getById: jest.fn(async () => [
      { _id: mockRoot, permissions: 63, users: [] },
    ]),
    getExternalDomainChildren: jest.fn(async () => []),
  },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)
jest.mock(`${process.cwd()}/lib/logger/logger`, () => ({
  info() {},
  warn() {},
  error() {},
  debug() {},
}))

const { putUserEntitlement } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/entitlements`,
)
const { exchangeExternalIdentity } = require(
  `${process.cwd()}/components/WebServer/controllers/apikey/exchange`,
)
const { permissionSession } = require(
  `${process.cwd()}/components/WebServer/middlewares/access/organization`,
)
const TokenHandler = require(
  `${process.cwd()}/components/WebServer/controllers/apikey/token`,
)

const IDENTITY = { provider: "twake", subject: "jdoe", email: "jdoe@twake.app" }
const LIVE = { transcription: { live: true } }
let clock = Date.parse("2026-09-14T10:00:00Z")

async function setRights(features) {
  const next = jest.fn()
  const res = { status: () => res, send: () => res }
  clock += 60e3
  await putUserEntitlement(
    {
      params: { organizationId: ROOT, email: IDENTITY.email },
      body: {
        subject: IDENTITY.subject,
        features,
        updatedAt: new Date(clock).toISOString(),
      },
    },
    res,
    next,
  )
  expect(next).not.toHaveBeenCalled()
}

async function startSession(userId) {
  const next = jest.fn()
  await permissionSession(
    {
      method: "POST",
      path: "/",
      payload: { data: { userId } },
      params: { organizationId: ROOT },
      query: {},
    },
    {},
    next,
  )
  return next.mock.calls[0][0]
}

const exchange = () =>
  exchangeExternalIdentity({ organizationId: ROOT, ...IDENTITY }, "integration")

beforeEach(() => {
  jest.clearAllMocks()
  mockDb.records.clear()
  mockDb.keys = []
  mockDb.tokens = []
})

test("losing every right then regaining it changes access, never the key's tokens", async () => {
  await setRights(LIVE)
  const { userId } = await exchange()
  expect(await startSession(userId)).toBeUndefined()
  const tokens = JSON.stringify(mockDb.tokens)

  await setRights({})
  expect((await startSession(userId)).code).toBe("no_entitlement")
  await expect(exchange()).rejects.toMatchObject({ code: "no_entitlement" })
  expect(JSON.stringify(mockDb.tokens)).toBe(tokens)

  await setRights(LIVE)
  expect(JSON.stringify(mockDb.tokens)).toBe(tokens)
  expect(await startSession(userId)).toBeUndefined()
  await expect(exchange()).resolves.toMatchObject({ userId, created: false })
})

test("a key revoked by an administrator stays revoked after a PUT with rights", async () => {
  await setRights(LIVE)
  const { userId } = await exchange()
  await TokenHandler.deleteApiKey(userId, "true")

  await setRights({ ...LIVE, summary: true })
  expect(mockOwnTokens(userId)).toEqual([])
  await expect(exchange()).rejects.toMatchObject({ code: "revoked" })
})
