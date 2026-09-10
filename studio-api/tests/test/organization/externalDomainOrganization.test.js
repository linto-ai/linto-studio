/**
 * One Studio organization per external domain (`ensureDomainOrganization`):
 * `PUT /api/v1/organizations/{root}/entitlements/domains/{domain}` gives the
 * domain its own organization — created once, managed, attached to the root
 * by `metadata.parentOrganizationId`, with the caller as ADMIN and owner — and
 * never deletes one (VISIO-USER-API-KEY-AUTH-ANALYSIS.md §6 ter C1).
 */
jest.mock("debug", () => () => () => {})

const mockModel = {
  organizations: {
    getByExternalDomain: jest.fn(),
    create: jest.fn(),
    getById: jest.fn(),
    delete: jest.fn(),
  },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)
jest.mock(`${process.cwd()}/lib/logger/logger`, () => ({
  info() {},
  warn() {},
  error() {},
  debug() {},
}))

const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const { ensureDomainOrganization } = require(
  `${process.cwd()}/components/WebServer/controllers/organization/externalDomain`,
)

const ROOT = "0123456789abcdef01234567"
const DOMAIN_ORG = "fedcba9876543210fedcba98"
const CALLER = "cccccccccccccccccccccccc"

beforeEach(() => {
  jest.clearAllMocks()
  mockModel.organizations.getByExternalDomain.mockResolvedValue([])
  mockModel.organizations.create.mockResolvedValue({
    insertedCount: 1,
    insertedId: DOMAIN_ORG,
  })
  mockModel.organizations.getById.mockResolvedValue([
    { _id: DOMAIN_ORG, name: "collectivite.fr" },
  ])
})

test("creates the organization named after the domain, caller ADMIN and owner", async () => {
  const { organization, created } = await ensureDomainOrganization({
    rootOrganizationId: ROOT,
    domain: "collectivite.fr",
    provider: "external",
    callerId: CALLER,
  })
  expect(created).toBe(true)
  expect(organization._id).toBe(DOMAIN_ORG)
  const payload = mockModel.organizations.create.mock.calls[0][0]
  expect(payload.name).toBe("collectivite.fr")
  expect(payload.owner).toBe(CALLER)
  expect(payload.users).toEqual([{ userId: CALLER, role: ROLES.ADMIN }])
  expect(payload.metadata).toEqual({
    parentOrganizationId: ROOT,
    externalDomain: "collectivite.fr",
    provider: "external",
    managed: true,
  })
})

test("is created only once: a second call reuses the existing organization", async () => {
  mockModel.organizations.getByExternalDomain.mockResolvedValue([
    { _id: DOMAIN_ORG, name: "collectivite.fr" },
  ])
  const { organization, created } = await ensureDomainOrganization({
    rootOrganizationId: ROOT,
    domain: "collectivite.fr",
    provider: "external",
    callerId: CALLER,
  })
  expect(created).toBe(false)
  expect(organization._id).toBe(DOMAIN_ORG)
  expect(mockModel.organizations.create).not.toHaveBeenCalled()
})

test("never deletes an organization", async () => {
  await ensureDomainOrganization({
    rootOrganizationId: ROOT,
    domain: "collectivite.fr",
    provider: "external",
    callerId: CALLER,
  })
  expect(mockModel.organizations.delete).not.toHaveBeenCalled()
})

test("a failed creation is a 400, not a half-created organization", async () => {
  mockModel.organizations.create.mockResolvedValue({ insertedCount: 0 })
  await expect(
    ensureDomainOrganization({
      rootOrganizationId: ROOT,
      domain: "collectivite.fr",
      provider: "external",
      callerId: CALLER,
    }),
  ).rejects.toMatchObject({ status: 400 })
})
