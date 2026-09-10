/**
 * Who may call the identity bridge. Decision of 2026-09-10: no new platform
 * role — the INTEGRATION bit (32) added by step 3 is gone, and the credential
 * of an integration (the Meet backend) is a SYSTEM_ADMINISTRATOR acting with
 * `?userScope=backoffice`, the only existing role that crosses organizations.
 */
jest.mock("debug", () => () => () => {})
const mockModel = {
  users: { getById: jest.fn() },
  tokens: { constructor: { KIND_EXCHANGE: "exchange" } },
  externalEntitlements: { constructor: { KIND_USER: "user" } },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)
// The route file pulls the whole controller tree in; only the access rules
// are under test here.
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/organization/utility`,
  () => ({ addM2mUserToOrganization: jest.fn() }),
)

const ROLE = require(`${process.cwd()}/lib/dao/users/platformRole`)
const platform = require(
  `${process.cwd()}/components/WebServer/middlewares/access/platform`,
)
const externalRoutes = require(
  `${process.cwd()}/components/WebServer/routes/api/auth/external`,
)()

async function run(role, query = {}) {
  mockModel.users.getById.mockResolvedValue([{ _id: "u", role }])
  const next = jest.fn()
  await platform.isPlatformSystemAdministrator(
    { payload: { data: { userId: "u" } }, query, method: "POST" },
    {},
    next,
  )
  return next.mock.calls[0][0]
}

test("the INTEGRATION platform bit no longer exists", () => {
  expect(ROLE.INTEGRATION).toBeUndefined()
  expect(ROLE.integrationRole).toBeUndefined()
  expect(platform.isPlatformIntegration).toBeUndefined()
  // 32 is not a valid platform role any more
  expect(ROLE.isValid(32)).toBe(false)
  expect(ROLE.isValid(ROLE.USER + 32)).toBe(false)
  expect(ROLE.isValid(ROLE.superAdministratorRole())).toBe(true)
})

test("both bridge routes require a system administrator, and nothing else", () => {
  expect(externalRoutes.map((r) => `${r.method} ${r.path}`).sort()).toEqual([
    "post /resolve",
    "post /token",
  ])
  for (const route of externalRoutes) {
    expect(route.requireAuth).toBe(true)
    expect(route.requireSystemAdministrator).toBe(true)
    expect(route.requireIntegrationAccess).toBeUndefined()
  }
})

test("a SYSTEM_ADMINISTRATOR passes only with the backoffice scope", async () => {
  expect((await run(ROLE.systemAdministratorRole())).status).toBe(403)
  expect(
    await run(ROLE.systemAdministratorRole(), { userScope: "backoffice" }),
  ).toBeUndefined()
})

test("a plain user or an organization initiator is refused", async () => {
  expect((await run(ROLE.USER, { userScope: "backoffice" })).status).toBe(403)
  expect(
    (await run(ROLE.organizationInitiatorRole(), { userScope: "backoffice" }))
      .status,
  ).toBe(403)
})
