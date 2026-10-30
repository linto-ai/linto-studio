const mockModel = {
  users: { getById: jest.fn() },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)
jest.mock(`${process.cwd()}/lib/mailer/mailing`, () => ({}))
const mockAccess = { isSystemAdministrator: jest.fn(), isSuperAdmin: jest.fn() }
jest.mock(
  `${process.cwd()}/components/WebServer/middlewares/access/platform`,
  () => mockAccess,
)
for (const dep of [
  "controllers/files/store",
  "controllers/organization/utility",
  "controllers/user/utility",
  "controllers/user/discoverability",
  "controllers/speakerIdentification/triggers",
  "config/passport/token/generator",
]) {
  jest.mock(`${process.cwd()}/components/WebServer/${dep}`, () => ({}))
}

const ROLE = require(`${process.cwd()}/lib/dao/users/platformRole`)
const { getUserById } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/users/users`,
)
const { UserNotFound } = require(
  `${process.cwd()}/components/WebServer/error/exception/users`,
)

const ALICE = {
  _id: "u-alice",
  email: "alice@example.com",
  firstname: "Alice",
  lastname: "Martin",
  img: "a.jpg",
  private: false,
}

async function call(userId, { callerId = "me", role = ROLE.USER } = {}) {
  const req = {
    params: { userId },
    payload: { data: { userId: callerId, role } },
  }
  const res = { status: jest.fn().mockReturnThis(), send: jest.fn() }
  const next = jest.fn()
  await getUserById(req, res, next)
  return { res, next }
}

describe("getUserById", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockModel.users.getById.mockResolvedValue([{ ...ALICE }])
    mockAccess.isSystemAdministrator.mockResolvedValue(false)
    mockAccess.isSuperAdmin.mockResolvedValue(false)
  })

  it("never returns the address of someone else", async () => {
    const { res } = await call("u-alice")

    expect(res.status).toHaveBeenCalledWith(200)
    const [user] = res.send.mock.calls[0]
    expect(user).toEqual({
      _id: "u-alice",
      firstname: "Alice",
      lastname: "Martin",
      img: "a.jpg",
      private: false,
    })
  })

  it("returns the address to its owner", async () => {
    const { res } = await call("u-alice", { callerId: "u-alice" })

    const [user] = res.send.mock.calls[0]
    expect(user.email).toBe("alice@example.com")
  })

  it("returns the address to a system administrator", async () => {
    mockAccess.isSystemAdministrator.mockResolvedValue(true)

    const { res } = await call("u-alice", {
      role: ROLE.systemAdministratorRole(),
    })

    const [user] = res.send.mock.calls[0]
    expect(user.email).toBe("alice@example.com")
  })

  it("returns the address to a super administrator without the platform role", async () => {
    mockAccess.isSuperAdmin.mockResolvedValue(true)

    const { res } = await call("u-alice")

    const [user] = res.send.mock.calls[0]
    expect(user.email).toBe("alice@example.com")
  })

  it("answers not found for an unknown user", async () => {
    mockModel.users.getById.mockResolvedValue([])

    const { res, next } = await call("u-ghost")

    expect(res.send).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(expect.any(UserNotFound))
  })
})
