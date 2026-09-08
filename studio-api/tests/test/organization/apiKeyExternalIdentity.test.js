/**
 * Organization API keys carrying an external identity
 * (`metadata.externalIdentity`) — the provisioning contract of the identity
 * bridge (VISIO-USER-API-KEY-AUTH-ANALYSIS.md §4.3 [B2]):
 *
 *   - checkTokenBelongsToOrganization really checks the key's type (the
 *     condition was inverted and the public projection hid `type`);
 *   - POST tokens validates/normalises externalIdentity + quickMeeting and
 *     refuses a duplicate (provider, subject) in the organization (409);
 *   - GET tokens?externalSubject= / ?externalEmail= filter the list;
 *   - PATCH tokens/:id merges metadata (plan…) but never the identity.
 */
jest.mock("debug", () => () => () => {})
process.env.CM_JWT_SECRET = "test-cm-secret"

const mockModel = {
  users: {
    getById: jest.fn(),
    update: jest.fn(),
    createApiKey: jest.fn(),
    findApiKeyByExternalIdentity: jest.fn(),
    listApiKeyList: jest.fn(),
  },
  organizations: { getById: jest.fn(), update: jest.fn() },
  tokens: {
    insert: jest.fn(),
    getTokenByUser: jest.fn(),
    getTokenByList: jest.fn(),
    deleteAllUserTokens: jest.fn(),
  },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
  () => ({
    storeFile: jest.fn(),
    defaultPicture: () => "pictures/default.jpg",
    deleteFile: jest.fn(),
    getStorageFolder: () => "/tmp",
  }),
)
const mockAddM2m = jest.fn()
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/organization/utility`,
  () => ({ addM2mUserToOrganization: (...a) => mockAddM2m(...a) }),
)

const USER_TYPE = require(`${process.cwd()}/lib/dao/users/types`)
const {
  getApiKey,
  createApiKey,
  listApiKeyFromOrga,
  updateApiKey,
  deleteApiKey,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/apiKey`,
)

const ORG = "0123456789abcdef01234567"
const KEY = "aaaaaaaaaaaaaaaaaaaaaaaa"
const HUMAN = "bbbbbbbbbbbbbbbbbbbbbbbb"

function res() {
  const r = { status: jest.fn(() => r), send: jest.fn(() => r) }
  return r
}
function req(over = {}) {
  return {
    params: { organizationId: ORG },
    query: {},
    body: {},
    payload: { data: { userId: "admin" } },
    ...over,
  }
}
async function call(controller, r) {
  const rs = res()
  const next = jest.fn()
  await controller(r, rs, next)
  return { rs, next, err: next.mock.calls[0]?.[0] }
}

beforeEach(() => {
  jest.clearAllMocks()
  mockModel.organizations.getById.mockResolvedValue([
    {
      _id: ORG,
      users: [
        { userId: KEY, role: 4, type: USER_TYPE.M2M },
        { userId: HUMAN, role: 6, type: USER_TYPE.USER },
      ],
    },
  ])
  mockModel.tokens.getTokenByUser.mockResolvedValue([
    { _id: "tok", salt: "salt", userId: KEY, expiresIn: 1000 },
  ])
})

describe("checkTokenBelongsToOrganization (apiKey.js bug fix)", () => {
  test("accepts a machine user of the organization, read with the full projection", async () => {
    mockModel.users.getById.mockResolvedValue([
      { _id: KEY, type: USER_TYPE.M2M, role: 1 },
    ])
    const { err, rs } = await call(
      getApiKey,
      req({ params: { organizationId: ORG, tokenId: KEY } }),
    )
    expect(err).toBeUndefined()
    expect(rs.status).toHaveBeenCalledWith(200)
    // serverAccess=true: the public projection has no `type`
    expect(mockModel.users.getById).toHaveBeenCalledWith(KEY, true)
  })

  test("rejects a human user id passed as a token id", async () => {
    mockModel.users.getById.mockResolvedValue([
      { _id: HUMAN, type: USER_TYPE.USER, role: 1 },
    ])
    const { err } = await call(
      getApiKey,
      req({ params: { organizationId: ORG, tokenId: HUMAN } }),
    )
    expect(err).toBeDefined()
    expect(err.status).toBe(400)
    expect(err.message).toMatch(/not found/)
  })
})

describe("POST /organizations/:id/tokens with an external identity", () => {
  beforeEach(() => {
    mockModel.users.findApiKeyByExternalIdentity.mockResolvedValue([])
    mockModel.users.createApiKey.mockResolvedValue({
      insertedCount: 1,
      insertedId: KEY,
    })
    mockModel.users.getById.mockResolvedValue([{ _id: KEY, role: 0 }])
    mockModel.tokens.insert.mockResolvedValue({ insertedId: "tok" })
    mockModel.users.update.mockResolvedValue({ matchedCount: 1 })
  })

  test("normalises the identity (lowercase email) from a JSON object", async () => {
    const { err, rs } = await call(
      createApiKey,
      req({
        body: {
          name: "twake:jdoe",
          role: 4,
          expires_in: "3650d",
          metadata: {
            externalIdentity: {
              provider: "twake",
              subject: "jdoe",
              email: "JDoe@Twake.APP",
            },
            quickMeeting: "true",
            plan: { isPaying: true },
          },
        },
      }),
    )
    expect(err).toBeUndefined()
    expect(rs.status).toHaveBeenCalledWith(201)
    const stored = mockModel.users.createApiKey.mock.calls[0][0]
    expect(stored.metadata).toMatchObject({
      externalIdentity: {
        provider: "twake",
        subject: "jdoe",
        email: "jdoe@twake.app",
      },
      quickMeeting: true,
      plan: { isPaying: true },
      createdBy: "admin",
      organizationId: ORG,
    })
    expect(mockAddM2m).toHaveBeenCalledWith(ORG, KEY, 4)
  })

  test("accepts the metadata as a JSON string too (multipart form)", async () => {
    const { err } = await call(
      createApiKey,
      req({
        body: {
          role: 4,
          metadata: JSON.stringify({
            externalIdentity: { provider: "twake", email: "a@b.fr" },
          }),
        },
      }),
    )
    expect(err).toBeUndefined()
    const stored = mockModel.users.createApiKey.mock.calls[0][0]
    // no subject → the email is the subject
    expect(stored.metadata.externalIdentity).toEqual({
      provider: "twake",
      subject: "a@b.fr",
      email: "a@b.fr",
    })
  })

  test("refuses an invalid identity (400)", async () => {
    const { err } = await call(
      createApiKey,
      req({
        body: { role: 4, metadata: { externalIdentity: { subject: "x" } } },
      }),
    )
    expect(err.status).toBe(400)
    expect(err.message).toMatch(/provider/)
    expect(mockModel.users.createApiKey).not.toHaveBeenCalled()
  })

  test("refuses a duplicate (provider, subject) in the organization (409)", async () => {
    mockModel.users.findApiKeyByExternalIdentity.mockResolvedValue([
      { _id: KEY },
    ])
    const { err } = await call(
      createApiKey,
      req({
        body: {
          role: 4,
          metadata: {
            externalIdentity: { provider: "twake", subject: "jdoe" },
          },
        },
      }),
    )
    expect(err.status).toBe(409)
    expect(err.code).toBe("external_identity_conflict")
    expect(mockModel.users.findApiKeyByExternalIdentity).toHaveBeenCalledWith({
      provider: "twake",
      subject: "jdoe",
      organizationId: ORG,
    })
    expect(mockModel.users.createApiKey).not.toHaveBeenCalled()
  })
})

describe("GET /organizations/:id/tokens external filters", () => {
  beforeEach(() => {
    mockModel.users.listApiKeyList.mockResolvedValue([
      {
        _id: KEY,
        metadata: {
          externalIdentity: {
            provider: "twake",
            subject: "jdoe",
            email: "jdoe@twake.app",
          },
        },
      },
      {
        _id: HUMAN,
        metadata: {
          externalIdentity: {
            provider: "twake",
            subject: "other",
            email: "o@twake.app",
          },
        },
      },
    ])
    mockModel.tokens.getTokenByList.mockResolvedValue([])
    mockModel.organizations.getById.mockResolvedValue([
      {
        _id: ORG,
        users: [
          { userId: KEY, role: 4, type: USER_TYPE.M2M },
          { userId: HUMAN, role: 4, type: USER_TYPE.M2M },
        ],
      },
    ])
  })

  test("?externalSubject=<provider>:<subject>", async () => {
    const { rs } = await call(
      listApiKeyFromOrga,
      req({ query: { externalSubject: "twake:jdoe" } }),
    )
    const list = rs.send.mock.calls[0][0]
    expect(list.map((k) => k.userId)).toEqual([KEY])
  })

  test("?externalEmail= is case-insensitive", async () => {
    const { rs } = await call(
      listApiKeyFromOrga,
      req({ query: { externalEmail: "O@Twake.app" } }),
    )
    const list = rs.send.mock.calls[0][0]
    expect(list.map((k) => k.userId)).toEqual([HUMAN])
  })

  test("a malformed externalSubject is a 400", async () => {
    const { err } = await call(
      listApiKeyFromOrga,
      req({ query: { externalSubject: "jdoe" } }),
    )
    expect(err.status).toBe(400)
  })
})

describe("PATCH /organizations/:id/tokens/:id metadata", () => {
  beforeEach(() => {
    mockModel.users.getById.mockResolvedValue([
      {
        _id: KEY,
        type: USER_TYPE.M2M,
        metadata: {
          externalIdentity: { provider: "twake", subject: "jdoe" },
          quickMeeting: true,
          plan: { isPaying: true },
          organizationId: ORG,
        },
      },
    ])
    mockModel.users.update.mockResolvedValue({ matchedCount: 1 })
  })

  test("merges plan / quickMeeting and keeps the identity", async () => {
    const { err, rs } = await call(
      updateApiKey,
      req({
        params: { organizationId: ORG, tokenId: KEY },
        body: { metadata: { plan: { isPaying: false }, quickMeeting: false } },
      }),
    )
    expect(err).toBeUndefined()
    expect(rs.status).toHaveBeenCalledWith(200)
    expect(mockModel.users.update).toHaveBeenCalledWith({
      _id: KEY,
      metadata: {
        externalIdentity: { provider: "twake", subject: "jdoe" },
        quickMeeting: false,
        plan: { isPaying: false },
        organizationId: ORG,
      },
    })
  })

  test("refuses to change the external identity", async () => {
    const { err } = await call(
      updateApiKey,
      req({
        params: { organizationId: ORG, tokenId: KEY },
        body: {
          metadata: { externalIdentity: { provider: "x", subject: "y" } },
        },
      }),
    )
    expect(err.status).toBe(400)
    expect(mockModel.users.update).not.toHaveBeenCalled()
  })

  test("still updates the name alone", async () => {
    const { err } = await call(
      updateApiKey,
      req({
        params: { organizationId: ORG, tokenId: KEY },
        body: { name: "renamed" },
      }),
    )
    expect(err).toBeUndefined()
    expect(mockModel.users.update).toHaveBeenCalledWith({
      _id: KEY,
      firstname: "renamed",
    })
  })
})

describe("DELETE /organizations/:id/tokens/:id", () => {
  beforeEach(() => {
    mockModel.users.getById.mockResolvedValue([
      { _id: KEY, type: USER_TYPE.M2M },
    ])
    mockModel.organizations.update.mockResolvedValue({ matchedCount: 1 })
    mockModel.tokens.deleteAllUserTokens.mockResolvedValue({ deletedCount: 1 })
    mockModel.users.delete = jest.fn().mockResolvedValue({ deletedCount: 1 })
  })

  test("?revoke=true drops the tokens but keeps the membership (refreshable later)", async () => {
    const { err, rs } = await call(
      deleteApiKey,
      req({
        params: { organizationId: ORG, tokenId: KEY },
        query: { revoke: "true" },
      }),
    )
    expect(err).toBeUndefined()
    expect(rs.status).toHaveBeenCalledWith(200)
    expect(mockModel.tokens.deleteAllUserTokens).toHaveBeenCalledWith(KEY)
    expect(mockModel.organizations.update).not.toHaveBeenCalled()
    expect(mockModel.users.delete).not.toHaveBeenCalled()
  })

  test("a plain DELETE removes the membership and the user", async () => {
    const { err } = await call(
      deleteApiKey,
      req({ params: { organizationId: ORG, tokenId: KEY } }),
    )
    expect(err).toBeUndefined()
    const updated = mockModel.organizations.update.mock.calls[0][0]
    expect(updated.users.map((u) => u.userId)).toEqual([HUMAN])
    expect(mockModel.users.delete).toHaveBeenCalledWith(KEY)
  })
})
