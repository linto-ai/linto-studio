/**
 * Entitlements API v1
 * (`/api/v1/organizations/{org}/entitlements/{users/{email}|domains/{domain}}`):
 * the contract an external billing system (Twake) calls to declare the AI
 * rights of its users and of its organizations
 * (`docs-twake/contrat-api-entitlements.md`, VISIO-USER-API-KEY-AUTH-ANALYSIS.md
 * §4.3 [B2]).
 *
 * Mongo, the organization creation and the linked-key hygiene are mocked; the
 * body parsing, the order guard, the idempotence and the response shapes are
 * the real thing.
 */
jest.mock("debug", () => () => () => {})

const mockModel = {
  externalEntitlements: {
    getUser: jest.fn(),
    getDomain: jest.fn(),
    upsert: jest.fn(),
    deleteOne: jest.fn(),
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
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)

const mockEnsureOrg = jest.fn()
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/organization/externalDomain`,
  () => ({ ensureDomainOrganization: (...a) => mockEnsureOrg(...a) }),
)
const mockRevoke = jest.fn()
const mockReactivate = jest.fn()
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/entitlement/key`,
  () => ({
    revokeLinkedKey: (...a) => mockRevoke(...a),
    reactivateLinkedKey: (...a) => mockReactivate(...a),
  }),
)
jest.mock(`${process.cwd()}/lib/logger/logger`, () => ({
  info() {},
  warn() {},
  error() {},
  debug() {},
}))

const {
  putUserEntitlement,
  deleteUserEntitlement,
  getUserEntitlement,
  putDomainEntitlement,
  getDomainEntitlement,
  parseFeatures,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/entitlements`,
)

const ROOT = "0123456789abcdef01234567"
const DOMAIN_ORG = "fedcba9876543210fedcba98"
const CALLER = "cccccccccccccccccccccccc"
const LIVE = { transcription: { live: true, async: true } }

function res() {
  const r = { status: jest.fn(() => r), send: jest.fn(() => r) }
  return r
}
async function call(controller, r) {
  const rs = res()
  const next = jest.fn()
  await controller(
    { payload: { data: { userId: CALLER } }, query: {}, body: {}, ...r },
    rs,
    next,
  )
  return {
    rs,
    next,
    err: next.mock.calls[0]?.[0],
    status: rs.status.mock.calls[0]?.[0],
    body: rs.send.mock.calls[0]?.[0],
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  mockModel.externalEntitlements.getUser.mockResolvedValue([])
  mockModel.externalEntitlements.getDomain.mockResolvedValue([])
  mockModel.externalEntitlements.upsert.mockResolvedValue({ upsertedCount: 1 })
  mockModel.externalEntitlements.deleteOne.mockResolvedValue({
    deletedCount: 1,
  })
  mockEnsureOrg.mockResolvedValue({
    organization: { _id: DOMAIN_ORG, name: "collectivite.fr" },
    created: true,
  })
})

describe("features", () => {
  test("keeps unknown keys and nested objects, absent stays absent", () => {
    expect(
      parseFeatures({
        transcription: { live: true, async: false },
        summary: false,
        unknownFeature: { deep: true },
      }),
    ).toEqual({
      transcription: { live: true, async: false },
      summary: false,
      unknownFeature: { deep: true },
    })
    expect(parseFeatures({})).toEqual({})
  })

  test("refuses a value that is neither a boolean nor an object", () => {
    expect(() => parseFeatures({ transcription: "yes" })).toThrow(
      /transcription must be a boolean or an object/,
    )
    expect(() => parseFeatures({ a: { b: 1 } })).toThrow(
      /features\.a\.b must be a boolean or an object/,
    )
  })
})

describe("PUT users/{email}", () => {
  test("upserts, answers 200 (never 201), lowercases the email", async () => {
    const { status, body, err } = await call(putUserEntitlement, {
      params: { organizationId: ROOT, email: "JDoe%40Twake.app" },
      body: {
        subject: "jdoe",
        features: LIVE,
        plan: "premium",
        updatedAt: "2026-09-14T10:32:00Z",
      },
    })
    expect(err).toBeUndefined()
    expect(status).toBe(200)
    const [key, values] = mockModel.externalEntitlements.upsert.mock.calls[0]
    expect(key).toEqual({
      organizationId: ROOT,
      provider: "external",
      kind: "user",
      email: "jdoe@twake.app",
    })
    expect(values).toMatchObject({
      subject: "jdoe",
      features: LIVE,
      plan: "premium",
      updatedAt: "2026-09-14T10:32:00.000Z",
    })
    expect(body).toEqual({
      kind: "user",
      organizationId: ROOT,
      provider: "external",
      email: "jdoe@twake.app",
      subject: "jdoe",
      features: LIVE,
      plan: "premium",
      updatedAt: "2026-09-14T10:32:00.000Z",
    })
    // active features re-activate the key if it was revoked; no key is created
    expect(mockReactivate).toHaveBeenCalledWith({
      provider: "external",
      subject: "jdoe",
      email: "jdoe@twake.app",
    })
    expect(mockRevoke).not.toHaveBeenCalled()
  })

  test("replaying the same message twice lands on the same state", async () => {
    const message = {
      params: { organizationId: ROOT, email: "jdoe@twake.app" },
      body: {
        subject: "jdoe",
        features: LIVE,
        updatedAt: "2026-09-14T10:32:00Z",
      },
    }
    const first = await call(putUserEntitlement, message)
    mockModel.externalEntitlements.getUser.mockResolvedValue([
      { _id: "x", ...first.body, created: "c" },
    ])
    mockModel.externalEntitlements.upsert.mockResolvedValue({ matchedCount: 1 })
    const second = await call(putUserEntitlement, message)
    expect(second.status).toBe(200)
    expect(second.body).toEqual(first.body)
    expect(second.body.ignored).toBeUndefined()
    // one record, upserted twice on the same key: no duplicate
    expect(mockModel.externalEntitlements.upsert.mock.calls[1][0]).toEqual(
      mockModel.externalEntitlements.upsert.mock.calls[0][0],
    )
    // and `created` is not re-stamped on the replay
    expect(
      mockModel.externalEntitlements.upsert.mock.calls[1][1].created,
    ).toBeUndefined()
  })

  test("an older updatedAt is ignored (200 {ignored:true}), nothing written", async () => {
    mockModel.externalEntitlements.getUser.mockResolvedValue([
      {
        _id: "x",
        organizationId: ROOT,
        provider: "external",
        kind: "user",
        email: "jdoe@twake.app",
        features: LIVE,
        plan: null,
        updatedAt: "2026-09-14T10:32:00.000Z",
      },
    ])
    const { status, body } = await call(putUserEntitlement, {
      params: { organizationId: ROOT, email: "jdoe@twake.app" },
      body: { features: {}, updatedAt: "2026-09-14T09:00:00Z" },
    })
    expect(status).toBe(200)
    expect(body.ignored).toBe(true)
    expect(body.features).toEqual(LIVE)
    expect(mockModel.externalEntitlements.upsert).not.toHaveBeenCalled()
    expect(mockRevoke).not.toHaveBeenCalled()
  })

  test("a newer updatedAt with empty features revokes the linked key", async () => {
    mockModel.externalEntitlements.getUser.mockResolvedValue([
      {
        _id: "x",
        organizationId: ROOT,
        provider: "external",
        kind: "user",
        email: "jdoe@twake.app",
        subject: "jdoe",
        features: LIVE,
        updatedAt: "2026-09-14T10:32:00.000Z",
      },
    ])
    const { status, body } = await call(putUserEntitlement, {
      params: { organizationId: ROOT, email: "jdoe@twake.app" },
      body: { features: {}, updatedAt: "2026-09-15T10:32:00Z" },
    })
    expect(status).toBe(200)
    expect(body.features).toEqual({})
    // the subject of the known record is kept when the message omits it
    expect(body.subject).toBe("jdoe")
    expect(mockRevoke).toHaveBeenCalledWith({
      provider: "external",
      subject: "jdoe",
      email: "jdoe@twake.app",
    })
    expect(mockReactivate).not.toHaveBeenCalled()
  })

  test("400 on an invalid body or email", async () => {
    const noFeatures = await call(putUserEntitlement, {
      params: { organizationId: ROOT, email: "jdoe@twake.app" },
      body: { subject: "jdoe" },
    })
    expect(noFeatures.err.status).toBe(400)
    expect(noFeatures.err.error).toMatch(/features is required/)

    const badEmail = await call(putUserEntitlement, {
      params: { organizationId: ROOT, email: "not-an-email" },
      body: { features: {} },
    })
    expect(badEmail.err.status).toBe(400)

    const badDate = await call(putUserEntitlement, {
      params: { organizationId: ROOT, email: "jdoe@twake.app" },
      body: { features: {}, updatedAt: "yesterday" },
    })
    expect(badDate.err.status).toBe(400)
    expect(mockModel.externalEntitlements.upsert).not.toHaveBeenCalled()
  })
})

describe("DELETE users/{email}", () => {
  test("204 and revokes, 204 again when nothing was there", async () => {
    mockModel.externalEntitlements.getUser.mockResolvedValueOnce([
      { _id: "x", subject: "jdoe", email: "jdoe@twake.app" },
    ])
    const first = await call(deleteUserEntitlement, {
      params: { organizationId: ROOT, email: "jdoe@twake.app" },
    })
    expect(first.status).toBe(204)
    expect(first.body).toBeUndefined()
    expect(mockRevoke).toHaveBeenCalledWith({
      provider: "external",
      subject: "jdoe",
      email: "jdoe@twake.app",
    })

    mockModel.externalEntitlements.deleteOne.mockResolvedValue({
      deletedCount: 0,
    })
    const second = await call(deleteUserEntitlement, {
      params: { organizationId: ROOT, email: "jdoe@twake.app" },
    })
    expect(second.status).toBe(204)
    expect(second.err).toBeUndefined()
  })
})

describe("GET users/{email} and domains/{domain}", () => {
  test("200 with the current state, 404 when unknown", async () => {
    mockModel.externalEntitlements.getUser.mockResolvedValue([
      {
        _id: "x",
        organizationId: ROOT,
        provider: "external",
        kind: "user",
        email: "jdoe@twake.app",
        subject: "jdoe",
        features: LIVE,
        updatedAt: "2026-09-14T10:32:00.000Z",
        created: "c",
        last_update: "l",
      },
    ])
    const found = await call(getUserEntitlement, {
      params: { organizationId: ROOT, email: "jdoe@twake.app" },
    })
    expect(found.status).toBe(200)
    expect(found.body).toEqual({
      kind: "user",
      organizationId: ROOT,
      provider: "external",
      email: "jdoe@twake.app",
      subject: "jdoe",
      features: LIVE,
      plan: null,
      updatedAt: "2026-09-14T10:32:00.000Z",
    })

    mockModel.externalEntitlements.getUser.mockResolvedValue([])
    const missing = await call(getUserEntitlement, {
      params: { organizationId: ROOT, email: "jdoe@twake.app" },
    })
    expect(missing.err.status).toBe(404)

    mockModel.externalEntitlements.getDomain.mockResolvedValue([])
    const noDomain = await call(getDomainEntitlement, {
      params: { organizationId: ROOT, domain: "collectivite.fr" },
    })
    expect(noDomain.err.status).toBe(404)
  })
})

describe("PUT domains/{domain}", () => {
  test("creates the organization of the domain once and records it", async () => {
    const message = {
      params: { organizationId: ROOT, domain: "Collectivite.FR" },
      body: {
        features: LIVE,
        plan: "78acf033",
        updatedAt: "2026-09-14T10:32:00Z",
      },
    }
    const first = await call(putDomainEntitlement, message)
    expect(first.status).toBe(200)
    expect(mockEnsureOrg).toHaveBeenCalledWith({
      rootOrganizationId: ROOT,
      domain: "collectivite.fr",
      provider: "external",
      callerId: CALLER,
    })
    expect(first.body).toEqual({
      kind: "domain",
      organizationId: ROOT,
      provider: "external",
      domain: "collectivite.fr",
      domainOrganizationId: DOMAIN_ORG,
      features: LIVE,
      plan: "78acf033",
      updatedAt: "2026-09-14T10:32:00.000Z",
    })

    // replay: the same organization is reused, none is created again
    mockModel.externalEntitlements.getDomain.mockResolvedValue([
      { _id: "y", ...first.body, created: "c" },
    ])
    mockEnsureOrg.mockResolvedValue({
      organization: { _id: DOMAIN_ORG },
      created: false,
    })
    const second = await call(putDomainEntitlement, message)
    expect(second.body).toEqual(first.body)
    expect(
      mockEnsureOrg.mock.calls.filter((c) => c[0].domain === "collectivite.fr"),
    ).toHaveLength(2)
    expect(mockModel.externalEntitlements.upsert).toHaveBeenCalledTimes(2)
  })

  test("empty features keep the organization and its record", async () => {
    mockModel.externalEntitlements.getDomain.mockResolvedValue([
      {
        _id: "y",
        organizationId: ROOT,
        provider: "external",
        kind: "domain",
        domain: "collectivite.fr",
        domainOrganizationId: DOMAIN_ORG,
        features: LIVE,
        updatedAt: "2026-09-14T10:32:00.000Z",
      },
    ])
    mockEnsureOrg.mockResolvedValue({
      organization: { _id: DOMAIN_ORG },
      created: false,
    })
    const { status, body } = await call(putDomainEntitlement, {
      params: { organizationId: ROOT, domain: "collectivite.fr" },
      body: { features: {}, updatedAt: "2026-09-20T10:32:00Z" },
    })
    expect(status).toBe(200)
    expect(body.features).toEqual({})
    expect(body.domainOrganizationId).toBe(DOMAIN_ORG)
    // a domain never fans out a revocation: the gates read the state live
    expect(mockRevoke).not.toHaveBeenCalled()
  })

  test("an older updatedAt is ignored before any organization is created", async () => {
    mockModel.externalEntitlements.getDomain.mockResolvedValue([
      {
        _id: "y",
        organizationId: ROOT,
        provider: "external",
        kind: "domain",
        domain: "collectivite.fr",
        domainOrganizationId: DOMAIN_ORG,
        features: LIVE,
        updatedAt: "2026-09-14T10:32:00.000Z",
      },
    ])
    const { status, body } = await call(putDomainEntitlement, {
      params: { organizationId: ROOT, domain: "collectivite.fr" },
      body: { features: {}, updatedAt: "2026-09-01T10:32:00Z" },
    })
    expect(status).toBe(200)
    expect(body.ignored).toBe(true)
    expect(mockEnsureOrg).not.toHaveBeenCalled()
    expect(mockModel.externalEntitlements.upsert).not.toHaveBeenCalled()
  })

  test("400 when a domain message carries a subject", async () => {
    const { err } = await call(putDomainEntitlement, {
      params: { organizationId: ROOT, domain: "collectivite.fr" },
      body: { subject: "nope", features: {} },
    })
    expect(err.status).toBe(400)
    expect(mockEnsureOrg).not.toHaveBeenCalled()
  })
})
