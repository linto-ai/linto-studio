/**
 * External domains of an organization
 * (`PUT/GET/DELETE /api/organizations/{org}/external-domains/{domain}`):
 * the per-domain paying / AI state pushed by Twake B2B, consumed by the
 * identity bridge for just-in-time keys.
 */
jest.mock("debug", () => () => () => {})

const mockModel = {
  externalDomains: {
    getByOrganization: jest.fn(),
    get: jest.fn(),
    upsert: jest.fn(),
    delete: jest.fn(),
    constructor: {
      isActive: (d) => !!d && d.paying === true && d.ai?.transcription === true,
    },
  },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)

const {
  listExternalDomains,
  getExternalDomain,
  upsertExternalDomain,
  deleteExternalDomain,
  parseBody,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/externalDomains`,
)

const ORG = "0123456789abcdef01234567"

function res() {
  const r = { status: jest.fn(() => r), send: jest.fn(() => r) }
  return r
}
async function call(controller, r) {
  const rs = res()
  const next = jest.fn()
  await controller(r, rs, next)
  return {
    rs,
    next,
    err: next.mock.calls[0]?.[0],
    body: rs.send.mock.calls[0]?.[0],
  }
}

beforeEach(() => jest.clearAllMocks())

describe("parseBody", () => {
  test("coerces booleans and numbers, stamps updatedAt", () => {
    const v = parseBody({
      paying: "true",
      ai: { transcription: "false", liveMinutesPerMonth: "-1" },
      plan: "p1",
    })
    expect(v).toMatchObject({
      paying: true,
      ai: { transcription: false, liveMinutesPerMonth: -1 },
      plan: "p1",
    })
    expect(typeof v.updatedAt).toBe("string")
  })
  test("rejects a non-object ai", () => {
    expect(() => parseBody({ ai: "yes" })).toThrow(/ai must be an object/)
  })
})

describe("PUT /external-domains/:domain", () => {
  test("creates the record (201), lowercase domain, active computed", async () => {
    mockModel.externalDomains.get
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        {
          _id: "x",
          organizationId: ORG,
          domain: "collectivite.fr",
          paying: true,
          ai: { transcription: true, liveMinutesPerMonth: -1 },
          plan: "78ac",
          updatedAt: "2026-09-08T10:00:00.000Z",
        },
      ])
    mockModel.externalDomains.upsert.mockResolvedValue({
      matchedCount: 0,
      upsertedCount: 1,
    })
    const { err, rs, body } = await call(upsertExternalDomain, {
      params: { organizationId: ORG, domain: "Collectivite.FR" },
      body: {
        paying: true,
        ai: { transcription: true, liveMinutesPerMonth: -1 },
        plan: "78ac",
        updatedAt: "2026-09-08T10:00:00Z",
      },
    })
    expect(err).toBeUndefined()
    expect(rs.status).toHaveBeenCalledWith(201)
    const [orgId, domain, values] =
      mockModel.externalDomains.upsert.mock.calls[0]
    expect(orgId).toBe(ORG)
    expect(domain).toBe("collectivite.fr")
    expect(values).toMatchObject({
      paying: true,
      ai: { transcription: true, liveMinutesPerMonth: -1 },
      plan: "78ac",
      updatedAt: "2026-09-08T10:00:00.000Z",
    })
    expect(values.created).toBeDefined()
    expect(body).toMatchObject({ domain: "collectivite.fr", active: true })
    expect(body._id).toBeUndefined()
  })

  test("is idempotent: a replay updates (200) and turning isPaying off deactivates", async () => {
    const existing = {
      _id: "x",
      organizationId: ORG,
      domain: "collectivite.fr",
      paying: true,
      ai: { transcription: true },
      plan: "78ac",
      created: "c",
    }
    mockModel.externalDomains.get
      .mockResolvedValueOnce([existing])
      .mockResolvedValueOnce([{ ...existing, paying: false }])
    mockModel.externalDomains.upsert.mockResolvedValue({ matchedCount: 1 })
    const { rs, body } = await call(upsertExternalDomain, {
      params: { organizationId: ORG, domain: "collectivite.fr" },
      body: { paying: false },
    })
    expect(rs.status).toHaveBeenCalledWith(200)
    const values = mockModel.externalDomains.upsert.mock.calls[0][2]
    expect(values).toMatchObject({
      paying: false,
      ai: { transcription: true },
      plan: "78ac",
      created: "c",
    })
    expect(body.active).toBe(false)
  })

  test("rejects an invalid domain (400)", async () => {
    const { err } = await call(upsertExternalDomain, {
      params: { organizationId: ORG, domain: "not a domain" },
      body: {},
    })
    expect(err.status).toBe(400)
    expect(mockModel.externalDomains.upsert).not.toHaveBeenCalled()
  })
})

describe("GET / DELETE", () => {
  test("list presents active", async () => {
    mockModel.externalDomains.getByOrganization.mockResolvedValue([
      { _id: "1", domain: "a.fr", paying: true, ai: { transcription: true } },
      { _id: "2", domain: "b.fr", paying: true, ai: { transcription: false } },
    ])
    const { body } = await call(listExternalDomains, {
      params: { organizationId: ORG },
    })
    expect(body.map((d) => [d.domain, d.active])).toEqual([
      ["a.fr", true],
      ["b.fr", false],
    ])
  })
  test("get unknown → 404", async () => {
    mockModel.externalDomains.get.mockResolvedValue([])
    const { err } = await call(getExternalDomain, {
      params: { organizationId: ORG, domain: "a.fr" },
    })
    expect(err.status).toBe(404)
  })
  test("delete unknown → 404, known → 200", async () => {
    mockModel.externalDomains.delete
      .mockResolvedValueOnce({ deletedCount: 0 })
      .mockResolvedValueOnce({ deletedCount: 1 })
    const first = await call(deleteExternalDomain, {
      params: { organizationId: ORG, domain: "a.fr" },
    })
    expect(first.err.status).toBe(404)
    const second = await call(deleteExternalDomain, {
      params: { organizationId: ORG, domain: "A.fr" },
    })
    expect(second.rs.status).toHaveBeenCalledWith(200)
    expect(mockModel.externalDomains.delete).toHaveBeenLastCalledWith(
      ORG,
      "a.fr",
    )
  })
})
