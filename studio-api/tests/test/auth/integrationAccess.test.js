/**
 * requireIntegrationAccess (identity bridge callers): an INTEGRATION
 * credential passes on its own bit; a SYSTEM_ADMINISTRATOR passes only with
 * `?userScope=backoffice` (the dev / transition credential); anyone else 403.
 */
jest.mock("debug", () => () => () => {})
const mockModel = { users: { getById: jest.fn() } }
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)

const ROLE = require(`${process.cwd()}/lib/dao/users/platformRole`)
const { isPlatformIntegration } = require(
  `${process.cwd()}/components/WebServer/middlewares/access/platform`,
)

async function run(role, query = {}) {
  mockModel.users.getById.mockResolvedValue([{ _id: "u", role }])
  const next = jest.fn()
  await isPlatformIntegration(
    { payload: { data: { userId: "u" } }, query, method: "POST" },
    {},
    next,
  )
  return next.mock.calls[0][0]
}

test("INTEGRATION is a valid platform role, outside the human ladder", () => {
  expect(ROLE.isValid(ROLE.integrationRole())).toBe(true)
  expect(ROLE.isValid(ROLE.superAdministratorRole())).toBe(true)
  expect(
    ROLE.hasPlatformRoleAccess(ROLE.superAdministratorRole(), ROLE.INTEGRATION),
  ).toBe(false)
  expect(ROLE.print(ROLE.integrationRole())).toBe("INTEGRATION")
})

test("an INTEGRATION credential passes without any scope", async () => {
  expect(await run(ROLE.integrationRole())).toBeUndefined()
})

test("a SYSTEM_ADMINISTRATOR passes only with the backoffice scope", async () => {
  expect((await run(ROLE.systemAdministratorRole())).status).toBe(403)
  expect(
    await run(ROLE.systemAdministratorRole(), { userScope: "backoffice" }),
  ).toBeUndefined()
})

test("a plain user / org initiator is refused", async () => {
  expect((await run(ROLE.USER)).status).toBe(403)
  expect(
    (await run(ROLE.organizationInitiatorRole(), { userScope: "backoffice" }))
      .status,
  ).toBe(403)
})
