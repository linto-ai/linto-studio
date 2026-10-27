jest.mock("debug", () => () => () => {})

const mockModel = {
  organizations: { getById: jest.fn() },
  users: { getById: jest.fn() },
  conversations: { getSharedConvFromOrga: jest.fn(async () => []) },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)
jest.mock(`${process.cwd()}/lib/mailer/mailing`, () => ({}))
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/conversation/child`,
  () => ({ updateChildConversation: jest.fn() }),
)

const mockUtility = { inviteMemberByEmail: jest.fn(async () => "u-invited") }
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/organization/utility`,
  () => mockUtility,
)
jest.mock(`${process.cwd()}/lib/saas`, () => ({ enforceSeats: jest.fn() }))

const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const { OrganizationUnsupportedMediaType } = require(
  `${process.cwd()}/components/WebServer/error/exception/organization`,
)
const { UserNotFound } = require(
  `${process.cwd()}/components/WebServer/error/exception/users`,
)
const { addUserInOrganization } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/maintainer`,
)

const ORGANIZATION = { _id: "org-1", name: "Org", users: [] }
const ADMIN = { _id: "u-admin", email: "admin@example.com" }
const PUBLIC_ID = "0123456789abcdef01234567"
const PRIVATE_ID = "0123456789abcdef01234568"

async function call(body) {
  const req = {
    body: { role: ROLES.MEMBER, ...body },
    params: { organizationId: "org-1" },
    payload: { data: { userId: ADMIN._id } },
    userRole: ROLES.ADMIN,
  }
  const res = { status: jest.fn().mockReturnThis(), send: jest.fn() }
  const next = jest.fn()
  await addUserInOrganization(req, res, next)
  return { res, next }
}

describe("addUserInOrganization", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockModel.organizations.getById.mockResolvedValue([ORGANIZATION])
    mockModel.users.getById.mockImplementation(async (id) => {
      if (id === ADMIN._id) return [ADMIN]
      if (id === PUBLIC_ID) return [{ _id: id, email: "bob@example.com" }]
      if (id === PRIVATE_ID)
        return [{ _id: id, email: "eve@example.com", private: true }]
      return []
    })
  })

  it("invites by email and names the address in the answer", async () => {
    const { res } = await call({ email: "bob@example.com" })

    expect(mockUtility.inviteMemberByEmail).toHaveBeenCalledWith(
      expect.objectContaining({ email: "bob@example.com" }),
    )
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.send).toHaveBeenCalledWith({
      message: "bob@example.com has been added to the organization",
    })
  })

  it("resolves a public user picked by id without echoing the address", async () => {
    const { res } = await call({ userId: PUBLIC_ID })

    expect(mockModel.users.getById).toHaveBeenCalledWith(PUBLIC_ID)
    expect(mockUtility.inviteMemberByEmail).toHaveBeenCalledWith(
      expect.objectContaining({ email: "bob@example.com" }),
    )
    expect(res.send).toHaveBeenCalledWith({
      message: "User has been added to the organization",
    })
  })

  it("adds a private user picked by id", async () => {
    const { res } = await call({ userId: PRIVATE_ID })

    expect(mockUtility.inviteMemberByEmail).toHaveBeenCalledWith(
      expect.objectContaining({ email: "eve@example.com" }),
    )
    expect(res.status).toHaveBeenCalledWith(201)
  })

  it("refuses a malformed id without querying", async () => {
    const { next } = await call({ userId: "<userId_to_add>" })

    expect(next).toHaveBeenCalledWith(expect.any(UserNotFound))
    expect(mockModel.users.getById).not.toHaveBeenCalled()
  })

  it("refuses an unknown id", async () => {
    const { next } = await call({ userId: "0123456789abcdef0123456b" })

    expect(next).toHaveBeenCalledWith(expect.any(UserNotFound))
    expect(mockUtility.inviteMemberByEmail).not.toHaveBeenCalled()
  })

  it("never invites an account without address", async () => {
    mockModel.users.getById.mockResolvedValueOnce([{ _id: "u-m2m" }])
    const { next } = await call({ userId: "u-m2m" })

    expect(next).toHaveBeenCalledWith(expect.any(UserNotFound))
    expect(mockUtility.inviteMemberByEmail).not.toHaveBeenCalled()
  })

  it("requires an email when no id is given", async () => {
    const { next } = await call({})

    expect(next).toHaveBeenCalledWith(
      expect.any(OrganizationUnsupportedMediaType),
    )
  })
})
