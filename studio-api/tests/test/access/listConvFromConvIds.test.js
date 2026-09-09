jest.mock(`${process.cwd()}/lib/mongodb/driver`, () => ({
  constructor: {
    db: { collection: () => ({}) },
    mongoDb: {
      ObjectId: class {
        constructor(id) {
          this.id = id
        }
      },
    },
  },
}))

const conversations = require(
  `${process.cwd()}/lib/mongodb/models/conversations`,
)
const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const RIGHTS = require(`${process.cwd()}/lib/dao/conversation/rights`)

let paginate

beforeEach(() => {
  paginate = jest
    .spyOn(conversations, "mongoAggregatePaginate")
    .mockResolvedValue({ list: [], count: 0 })
})

afterEach(() => paginate.mockRestore())

async function queryFor(role) {
  await conversations.listConvFromConvIds(
    ["507f1f77bcf86cd799439011"],
    "org-1",
    "user-1",
    role,
    RIGHTS.DELETE,
  )
  return paginate.mock.calls[0][0]
}

describe("listConvFromConvIds", () => {
  test("scopes the lookup to the organization", async () => {
    const query = await queryFor(ROLES.MAINTAINER)
    expect(query["organization.organizationId"]).toBe("org-1")
  })

  test("always accepts the owner", async () => {
    const query = await queryFor(ROLES.MEMBER)
    expect(query.$or).toContainEqual({ owner: "user-1" })
  })

  test("a member needs the members right on non-owned conversations", async () => {
    const query = await queryFor(ROLES.MEMBER)
    expect(query.$or[1]["organization.membersRight"]).toEqual({
      $bitsAnySet: RIGHTS.DELETE,
    })
  })

  test("a maintainer is not restricted by the members right", async () => {
    const query = await queryFor(ROLES.MAINTAINER)
    expect(query.$or[1]["organization.membersRight"]).toBeUndefined()
  })
})
