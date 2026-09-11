jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  users: { getById: jest.fn() },
}))
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/apikey/token`,
  () => ({ createApiKey: jest.fn(async () => ({ auth_token: "signed" })) }),
)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const PLATFORM_ROLE = require(`${process.cwd()}/lib/dao/users/platformRole`)
const { UserForbidden } = require(
  `${process.cwd()}/components/WebServer/error/exception/users`,
)
const TokenHandler = require(
  `${process.cwd()}/components/WebServer/controllers/apikey/token`,
)
const { createApiKeyPlatform } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/administration/apiKey`,
)

function call(callerRole, requestedRole) {
  model.users.getById.mockResolvedValue([{ _id: "caller", role: callerRole }])
  const req = {
    body: { role: requestedRole },
    payload: { data: { userId: "caller" } },
  }
  const res = { status: jest.fn(() => res), send: jest.fn() }
  const next = jest.fn()
  return createApiKeyPlatform(req, res, next).then(() => ({ res, next }))
}

beforeEach(() => jest.clearAllMocks())

describe("createApiKeyPlatform", () => {
  test("a system administrator cannot mint a super administrator key", async () => {
    const { next } = await call(
      PLATFORM_ROLE.systemAdministratorRole(),
      PLATFORM_ROLE.superAdministratorRole(),
    )
    expect(next.mock.calls[0][0]).toBeInstanceOf(UserForbidden)
    expect(TokenHandler.createApiKey).not.toHaveBeenCalled()
  })

  test("a system administrator cannot add bits it does not hold", async () => {
    const { next } = await call(
      PLATFORM_ROLE.systemAdministratorRole(),
      PLATFORM_ROLE.sessionOperatorRole(),
    )
    expect(next.mock.calls[0][0]).toBeInstanceOf(UserForbidden)
  })

  test("a super administrator can mint a super administrator key", async () => {
    const role = PLATFORM_ROLE.superAdministratorRole()
    const { res, next } = await call(role, role)
    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(201)
    expect(TokenHandler.createApiKey).toHaveBeenCalledWith(
      expect.anything(),
      role,
    )
  })

  test("a system administrator can mint a key at or below its role", async () => {
    const { res, next } = await call(
      PLATFORM_ROLE.systemAdministratorRole(),
      PLATFORM_ROLE.userRole(),
    )
    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(201)
  })
})
