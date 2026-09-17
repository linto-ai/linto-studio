jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  conversations: { getById: jest.fn() },
  organizations: { getById: jest.fn() },
}))
jest.mock(
  `${process.cwd()}/components/WebServer/middlewares/access/platform`,
  () => ({
    isReadOnlyScope: () => false,
    isSystemAdministrator: async () => false,
  }),
)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const RIGHTS = require(`${process.cwd()}/lib/dao/conversation/rights`)
const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const { ConversationReadAccessDenied, ConversationIdRequire } = require(
  `${process.cwd()}/components/WebServer/error/exception/conversation`,
)
const { asReadBatchAccess } = require(
  `${process.cwd()}/components/WebServer/middlewares/access/conversation`,
)

const CONVERSATIONS = {
  mine: {
    owner: "me",
    sharedWithUsers: [],
    organization: { organizationId: "org", customRights: [], membersRight: 0 },
  },
  shared: {
    owner: "other",
    sharedWithUsers: [{ userId: "me", right: RIGHTS.READ }],
    organization: { organizationId: "org", customRights: [], membersRight: 0 },
  },
  foreign: {
    owner: "other",
    sharedWithUsers: [],
    organization: {
      organizationId: "other-org",
      customRights: [],
      membersRight: RIGHTS.READ,
    },
  },
}

async function call(conversations) {
  const req = { body: { conversations }, payload: { data: { userId: "me" } } }
  const next = jest.fn()
  await asReadBatchAccess(req, {}, next)
  return next
}

beforeEach(() => {
  jest.clearAllMocks()
  model.conversations.getById.mockImplementation(async (id) =>
    CONVERSATIONS[id] ? [CONVERSATIONS[id]] : [],
  )
  model.organizations.getById.mockImplementation(async (id) => [
    {
      _id: id,
      users: id === "org" ? [{ userId: "me", role: ROLES.MEMBER }] : [],
    },
  ])
})

describe("asReadBatchAccess", () => {
  test("passes when every conversation is readable", async () => {
    const next = await call("mine,shared")
    expect(next).toHaveBeenCalledWith()
  })

  test("refuses as soon as one conversation is not readable", async () => {
    const next = await call("mine,foreign")
    expect(next.mock.calls[0][0]).toBeInstanceOf(ConversationReadAccessDenied)
  })

  test("refuses an unknown conversation", async () => {
    const next = await call("missing")
    expect(next.mock.calls[0][0]).toBeInstanceOf(ConversationReadAccessDenied)
  })

  test("requires a conversation list", async () => {
    const next = await call(undefined)
    expect(next.mock.calls[0][0]).toBeInstanceOf(ConversationIdRequire)
  })
})
