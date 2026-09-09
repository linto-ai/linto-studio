jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  organizations: { getById: jest.fn() },
  conversations: {},
}))

jest.mock(
  `${process.cwd()}/components/WebServer/middlewares/access/platform`,
  () => ({
    isReadOnlyScope: () => false,
    isSystemAdministrator: async () => false,
    isSessionOperator: async () => false,
  }),
)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const { OrganizationForbidden } = require(
  `${process.cwd()}/components/WebServer/error/exception/organization`,
)
const access = require(
  `${process.cwd()}/components/WebServer/middlewares/access/organization`,
)

const ORG_ID = "org-target"

function buildReq({ userId, body = {} }) {
  return {
    method: "DELETE",
    params: { organizationId: ORG_ID },
    payload: { data: { userId } },
    body,
  }
}

beforeEach(() => {
  model.organizations.getById.mockReset()
  model.organizations.getById.mockResolvedValue([
    {
      _id: ORG_ID,
      users: [
        { userId: "admin", role: ROLES.ADMIN },
        { userId: "member", role: ROLES.MEMBER },
      ],
    },
  ])
})

describe("organization access middleware", () => {
  test("a non-member is refused even when owning conversations", async () => {
    const next = jest.fn()
    const req = buildReq({
      userId: "outsider",
      body: { conversationsId: "conv-owned-by-outsider" },
    })

    await access.asAdminAccess(req, {}, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(next.mock.calls[0][0]).toBeInstanceOf(OrganizationForbidden)
    expect(req.userRole).toBeUndefined()
  })

  test("a member below the required role is refused even with conversationsId", async () => {
    const next = jest.fn()
    const req = buildReq({
      userId: "member",
      body: { conversationsId: "conv-owned-by-member" },
    })

    await access.asMaintainerAccess(req, {}, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(next.mock.calls[0][0]).toBeInstanceOf(OrganizationForbidden)
  })

  test("a member with the required role passes and gets its role", async () => {
    const next = jest.fn()
    const req = buildReq({ userId: "member" })

    await access.asMemberAccess(req, {}, next)

    expect(next).toHaveBeenCalledWith()
    expect(req.userRole).toBe(ROLES.MEMBER)
  })

  test("an admin passes the admin gate", async () => {
    const next = jest.fn()
    const req = buildReq({ userId: "admin" })

    await access.asAdminAccess(req, {}, next)

    expect(next).toHaveBeenCalledWith()
    expect(req.userRole).toBe(ROLES.ADMIN)
  })
})
