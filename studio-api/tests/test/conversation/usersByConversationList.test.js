jest.mock("debug", () => () => () => {})
jest.mock(`${process.cwd()}/lib/logger/logger`, () => ({
  info: jest.fn(),
  error: jest.fn(),
}))
const mockModel = {
  conversations: { getConvsListByIds: jest.fn() },
  organizations: { getByIds: jest.fn() },
  users: { getByIds: jest.fn() },
}
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => mockModel)
jest.mock(
  `${process.cwd()}/components/WebServer/middlewares/access/platform`,
  () => ({ isSystemAdministrator: async () => false }),
)
for (const module of [
  "components/WebServer/controllers/conversation/utility",
  "components/WebServer/controllers/organization/utility",
  "components/WebServer/controllers/job/fetchHandler",
  "components/WebServer/controllers/files/store",
  "components/WebServer/controllers/speakerIdentification/triggers",
  "lib/saas",
]) {
  jest.mock(`${process.cwd()}/${module}`, () => ({}))
}

const RIGHTS = require(`${process.cwd()}/lib/dao/conversation/rights`)
const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const USER_TYPE = require(`${process.cwd()}/lib/dao/users/types`)
const { ConversationNotFound } = require(
  `${process.cwd()}/components/WebServer/error/exception/conversation`,
)
const { getUsersByConversationList } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/conversation/conversation`,
)

const CONV_A = "aaaaaaaaaaaaaaaaaaaaaaa1"
const CONV_B = "aaaaaaaaaaaaaaaaaaaaaaa2"
const ORG = "bbbbbbbbbbbbbbbbbbbbbbb1"
const ME = "ccccccccccccccccccccccc1"
const ADMIN = "ccccccccccccccccccccccc2"
const GUEST = "ccccccccccccccccccccccc3"
const BOT = "ccccccccccccccccccccccc4"

const conversations = {
  [CONV_A]: {
    sharedWithUsers: [{ userId: GUEST, right: RIGHTS.READ }],
    organization: {
      organizationId: ORG,
      membersRight: RIGHTS.READ,
      customRights: [],
    },
  },
  [CONV_B]: {
    sharedWithUsers: [],
    organization: {
      organizationId: ORG,
      membersRight: RIGHTS.READ,
      customRights: [{ userId: ME, right: RIGHTS.READ + RIGHTS.WRITE }],
    },
  },
}
const organization = {
  users: [
    { userId: ME, role: ROLES.MEMBER },
    { userId: ADMIN, role: ROLES.ADMIN },
    { userId: BOT, role: ROLES.MEMBER, type: USER_TYPE.M2M },
  ],
}
const users = {
  [ME]: { firstname: "me" },
  [ADMIN]: { firstname: "admin" },
  [GUEST]: { firstname: "guest" },
}

async function call(ids, userId = ME) {
  const req = { body: { conversations: ids }, payload: { data: { userId } } }
  const res = { status: jest.fn().mockReturnThis(), send: jest.fn() }
  const next = jest.fn()
  await getUsersByConversationList(req, res, next)
  return { res, next }
}

beforeEach(() => {
  jest.clearAllMocks()
  mockModel.conversations.getConvsListByIds.mockImplementation(async (ids) =>
    ids
      .filter((id) => conversations[id])
      .map((id) => ({ _id: id, ...conversations[id] })),
  )
  mockModel.organizations.getByIds.mockImplementation(async (ids) =>
    ids.map((id) => ({ _id: id, ...organization })),
  )
  mockModel.users.getByIds.mockImplementation(async (ids) =>
    ids.filter((id) => users[id]).map((id) => ({ _id: id, ...users[id] })),
  )
})

describe("getUsersByConversationList", () => {
  test("answers each conversation with one query per collection", async () => {
    const { res } = await call(`${CONV_A},${CONV_B}`)

    expect(res.status).toHaveBeenCalledWith(200)
    const [result] = res.send.mock.calls[0]
    expect(result.map((entry) => entry.conversationId)).toEqual([
      CONV_A,
      CONV_B,
    ])

    const a = result[0].member
    expect(a.external_members.map((u) => u._id)).toEqual([GUEST])
    expect(a.organization_members.map((u) => u._id)).toEqual([ME, ADMIN])
    expect(a.organization_members[1].right).toBe(RIGHTS.adminRight())

    const b = result[1].member
    expect(b.external_members).toEqual([])
    expect(b.organization_members.find((u) => u._id === ME).right).toBe(
      RIGHTS.READ + RIGHTS.WRITE,
    )

    expect(mockModel.conversations.getConvsListByIds).toHaveBeenCalledTimes(1)
    expect(mockModel.organizations.getByIds).toHaveBeenCalledTimes(1)
    expect(mockModel.organizations.getByIds.mock.calls[0][0]).toEqual([ORG])
    expect(mockModel.users.getByIds).toHaveBeenCalledTimes(1)
    expect(mockModel.users.getByIds.mock.calls[0][0].sort()).toEqual(
      [GUEST, ME, ADMIN].sort(),
    )
  })

  test("hides organization members from a guest without the share right", async () => {
    const { res } = await call(CONV_A, GUEST)
    const [result] = res.send.mock.calls[0]
    expect(result[0].member.organization_members).toEqual([])
    expect(result[0].member.external_members.map((u) => u._id)).toEqual([GUEST])
  })

  test("rejects an unknown conversation", async () => {
    const { next, res } = await call(`${CONV_A},aaaaaaaaaaaaaaaaaaaaaaa9`)
    expect(next.mock.calls[0][0]).toBeInstanceOf(ConversationNotFound)
    expect(res.send).not.toHaveBeenCalled()
  })
})
