jest.mock("debug", () => () => () => {})

const mockModel = {
  organizations: { getById: jest.fn() },
  conversations: { listConvFromOwner: jest.fn() },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)

const organizationAccess = require(
  `${process.cwd()}/components/WebServer/middlewares/access/organization`,
)
const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const { OrganizationNotFound } = require(
  `${process.cwd()}/components/WebServer/error/exception/organization`,
)

const ADMIN = "user-admin"

function organization(extra = {}) {
  return [
    { _id: "org-1", users: [{ userId: ADMIN, role: ROLES.ADMIN }], ...extra },
  ]
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe("organization access with a pending checkout", () => {
  test("a pending org is not found, even for its admin", async () => {
    mockModel.organizations.getById.mockResolvedValue(
      organization({ pendingCheckout: { since: new Date(), invitations: [] } }),
    )
    const next = jest.fn()
    const req = {}
    await organizationAccess.access(req, next, "org-1", ADMIN, ROLES.ADMIN)
    expect(next).toHaveBeenCalledTimes(1)
    expect(next.mock.calls[0][0]).toBeInstanceOf(OrganizationNotFound)
    expect(req.userRole).toBeUndefined()
  })

  test("a regular org is unaffected", async () => {
    mockModel.organizations.getById.mockResolvedValue(organization())
    const next = jest.fn()
    const req = {}
    await organizationAccess.access(req, next, "org-1", ADMIN, ROLES.ADMIN)
    expect(next).toHaveBeenCalledWith()
    expect(req.userRole).toBe(ROLES.ADMIN)
  })
})
