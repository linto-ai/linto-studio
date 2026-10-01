jest.mock("debug", () => () => () => {})

const mockModel = {
  organizations: { getById: jest.fn(), update: jest.fn() },
  users: { getById: jest.fn() },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)

const mockMailing = { organizationRightUpdate: jest.fn() }
jest.mock(`${process.cwd()}/lib/mailer/mailing`, () => mockMailing)

jest.mock(
  `${process.cwd()}/components/WebServer/controllers/conversation/child`,
  () => ({ updateChildConversation: jest.fn() }),
)

const mockUtility = {
  countAdmin: (organization) => ({
    adminCount: organization.users.filter((u) => u.role === 6).length,
  }),
}
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/organization/utility`,
  () => mockUtility,
)

// Records the collaborators the seat gate sees at call time
const mockSaas = { enforceSeats: jest.fn() }
jest.mock(`${process.cwd()}/lib/saas`, () => mockSaas)

const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const { countCollaborators } = jest.requireActual(`${process.cwd()}/lib/saas`)
const { updateUserFromOrganization } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/maintainer`,
)

const ADMIN = "user-admin"
const MEMBER = "user-member"

function organization() {
  return {
    _id: "org-1",
    name: "Org",
    users: [
      { userId: ADMIN, role: ROLES.ADMIN },
      { userId: MEMBER, role: ROLES.MEMBER },
    ],
  }
}

async function promote(role) {
  const req = {
    params: { organizationId: "org-1" },
    body: { userId: MEMBER, role: String(role) },
    userRole: ROLES.ADMIN,
    payload: { data: { userId: ADMIN } },
  }
  const res = { status: jest.fn().mockReturnThis(), send: jest.fn() }
  const next = jest.fn()
  await updateUserFromOrganization(req, res, next)
  return { res, next }
}

beforeEach(() => {
  jest.clearAllMocks()
  mockModel.organizations.getById.mockResolvedValue([organization()])
  mockModel.organizations.update.mockResolvedValue({ matchedCount: 1 })
  mockModel.users.getById.mockResolvedValue([{ email: "m@x.io" }])
})

describe("seat gate on a member role change", () => {
  test("counts the collaborators before the change", async () => {
    let seen = null
    mockSaas.enforceSeats.mockImplementation(async (org, roles) => {
      seen = { used: countCollaborators(org), ...roles }
    })

    const { res, next } = await promote(ROLES.UPLOADER)

    expect(next).not.toHaveBeenCalled()
    expect(seen).toEqual({
      used: 1,
      fromRole: ROLES.MEMBER,
      toRole: ROLES.UPLOADER,
    })
    const saved = mockModel.organizations.update.mock.calls[0][0]
    expect(saved.users.find((u) => u.userId === MEMBER).role).toBe(
      ROLES.UPLOADER,
    )
    expect(res.status).toHaveBeenCalledWith(200)
  })

  test("a refused seat leaves the organization untouched", async () => {
    const denied = new Error("Quota exceeded: seats")
    mockSaas.enforceSeats.mockRejectedValue(denied)

    const { next } = await promote(ROLES.UPLOADER)

    expect(next).toHaveBeenCalledWith(denied)
    expect(mockModel.organizations.update).not.toHaveBeenCalled()
  })
})
