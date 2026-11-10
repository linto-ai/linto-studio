jest.mock("debug", () => () => () => {})
const mockModel = {
  users: {
    getByIds: jest.fn(),
    countSuperAdmins: jest.fn(),
    delete: jest.fn(),
  },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)
jest.mock(`${process.cwd()}/lib/mailer/mailing`, () => ({}))
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
  () => ({
    defaultPicture: "pictures/default.jpg",
  }),
)
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/organization/utility`,
  () => ({}),
)
const mockRemoveUserFromPlatform = jest.fn()
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/user/utility`,
  () => ({
    removeUserFromPlatform: (...args) => mockRemoveUserFromPlatform(...args),
  }),
)

const { UserError } = require(
  `${process.cwd()}/components/WebServer/error/exception/users`,
)
const { deleteUser } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/administration/users`,
)

let TOTAL_SUPER_ADMINS = 1
const SUPER = "ccccccccccccccccccccccc1"
const PLAIN = "ccccccccccccccccccccccc2"

async function call(userIds) {
  const req = { body: { userIds } }
  const res = { status: jest.fn().mockReturnThis(), send: jest.fn() }
  const next = jest.fn()
  await deleteUser(req, res, next)
  return { res, next }
}

beforeEach(() => {
  jest.clearAllMocks()
  // Platform wide count without ids, count among the given ids otherwise
  mockModel.users.countSuperAdmins.mockImplementation(async (ids) =>
    ids ? ids.filter((id) => id === SUPER).length : TOTAL_SUPER_ADMINS,
  )
  mockModel.users.delete.mockResolvedValue({ deletedCount: 1 })
  mockRemoveUserFromPlatform.mockResolvedValue()
})

describe("deleteUser", () => {
  test("keeps the last super administrator, counted among the ids", async () => {
    TOTAL_SUPER_ADMINS = 1
    const { next } = await call([SUPER, PLAIN])

    expect(next.mock.calls[0][0]).toBeInstanceOf(UserError)
    expect(mockModel.users.countSuperAdmins.mock.calls).toEqual([
      [[SUPER, PLAIN]],
      [],
    ])
    expect(mockModel.users.delete).not.toHaveBeenCalled()
  })

  test("deletes each user after its own cascade when admins remain", async () => {
    TOTAL_SUPER_ADMINS = 2
    const { res } = await call([SUPER, PLAIN])

    expect(res.status).toHaveBeenCalledWith(200)
    expect(mockRemoveUserFromPlatform.mock.calls.map((c) => c[0])).toEqual([
      SUPER,
      PLAIN,
    ])
    expect(mockModel.users.delete.mock.calls.map((c) => c[0])).toEqual([
      SUPER,
      PLAIN,
    ])
  })

  test("skips the platform wide count when no super admin is listed", async () => {
    await call([PLAIN])
    expect(mockModel.users.countSuperAdmins).toHaveBeenCalledTimes(1)
    expect(mockModel.users.countSuperAdmins).toHaveBeenCalledWith([PLAIN])
  })
})
