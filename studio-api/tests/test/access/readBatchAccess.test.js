jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  conversations: { getConvsListByIds: jest.fn() },
  organizations: { getByIds: jest.fn() },
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
const {
  ConversationReadAccessDenied,
  ConversationShareAccessDenied,
  ConversationNotShared,
  ConversationIdRequire,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/conversation`,
)
const { asReadBatchAccess, asShareBatchAccess } = require(
  `${process.cwd()}/components/WebServer/middlewares/access/conversation`,
)

// Valid object ids, the loader drops malformed ones before querying
const ID = {
  mine: "aaaaaaaaaaaaaaaaaaaaaaa1",
  shared: "aaaaaaaaaaaaaaaaaaaaaaa2",
  sharedRead: "aaaaaaaaaaaaaaaaaaaaaaa3",
  foreign: "aaaaaaaaaaaaaaaaaaaaaaa4",
  managed: "aaaaaaaaaaaaaaaaaaaaaaa5",
  orphan: "aaaaaaaaaaaaaaaaaaaaaaa6",
  missing: "aaaaaaaaaaaaaaaaaaaaaaa7",
}
const ORG = {
  member: "bbbbbbbbbbbbbbbbbbbbbbb1",
  maintainer: "bbbbbbbbbbbbbbbbbbbbbbb2",
  other: "bbbbbbbbbbbbbbbbbbbbbbb3",
  gone: "bbbbbbbbbbbbbbbbbbbbbbb4",
}

const inOrg = (organizationId, extra = {}) => ({
  organizationId,
  customRights: [],
  membersRight: 0,
  ...extra,
})

const CONVERSATIONS = {
  [ID.mine]: {
    owner: "me",
    sharedWithUsers: [],
    organization: inOrg(ORG.member),
  },
  [ID.shared]: {
    owner: "other",
    sharedWithUsers: [{ userId: "me", right: RIGHTS.READ + RIGHTS.SHARE }],
    organization: inOrg(ORG.other),
  },
  [ID.sharedRead]: {
    owner: "other",
    sharedWithUsers: [{ userId: "me", right: RIGHTS.READ }],
    organization: inOrg(ORG.other),
  },
  [ID.foreign]: {
    owner: "other",
    sharedWithUsers: [],
    organization: inOrg(ORG.other, { membersRight: RIGHTS.READ }),
  },
  [ID.managed]: {
    owner: "other",
    sharedWithUsers: [],
    organization: inOrg(ORG.maintainer),
  },
  [ID.orphan]: {
    owner: "other",
    sharedWithUsers: [],
    organization: inOrg(ORG.gone),
  },
}

const ORGANIZATIONS = {
  [ORG.member]: { users: [{ userId: "me", role: ROLES.MEMBER }] },
  [ORG.maintainer]: { users: [{ userId: "me", role: ROLES.MAINTAINER }] },
  [ORG.other]: { users: [] },
}

async function call(middleware, conversations) {
  const req = { body: { conversations }, payload: { data: { userId: "me" } } }
  const next = jest.fn()
  await middleware(req, {}, next)
  return next
}

beforeEach(() => {
  jest.clearAllMocks()
  model.conversations.getConvsListByIds.mockImplementation(async (ids) =>
    ids
      .filter((id) => CONVERSATIONS[id])
      .map((id) => ({ _id: id, ...CONVERSATIONS[id] })),
  )
  model.organizations.getByIds.mockImplementation(async (ids) =>
    ids
      .filter((id) => ORGANIZATIONS[id])
      .map((id) => ({ _id: id, ...ORGANIZATIONS[id] })),
  )
})

describe("asReadBatchAccess", () => {
  test("passes when every conversation is readable", async () => {
    const next = await call(asReadBatchAccess, `${ID.mine},${ID.shared}`)
    expect(next).toHaveBeenCalledWith()
  })

  test("refuses as soon as one conversation is not readable", async () => {
    const next = await call(asReadBatchAccess, `${ID.mine},${ID.foreign}`)
    expect(next.mock.calls[0][0]).toBeInstanceOf(ConversationReadAccessDenied)
  })

  test("refuses an unknown conversation", async () => {
    const next = await call(asReadBatchAccess, ID.missing)
    expect(next.mock.calls[0][0]).toBeInstanceOf(ConversationReadAccessDenied)
  })

  test("refuses a malformed id as an unknown conversation", async () => {
    const next = await call(asReadBatchAccess, "not-an-id")
    expect(next.mock.calls[0][0]).toBeInstanceOf(ConversationReadAccessDenied)
  })

  test("requires a conversation list", async () => {
    const next = await call(asReadBatchAccess, undefined)
    expect(next.mock.calls[0][0]).toBeInstanceOf(ConversationIdRequire)
  })

  test("runs one query per collection whatever the list size", async () => {
    await call(asReadBatchAccess, `${ID.mine},${ID.shared},${ID.managed}`)
    expect(model.conversations.getConvsListByIds).toHaveBeenCalledTimes(1)
    expect(model.organizations.getByIds).toHaveBeenCalledTimes(1)
    expect(model.organizations.getByIds.mock.calls[0][0].sort()).toEqual(
      [ORG.member, ORG.other, ORG.maintainer].sort(),
    )
  })
})

describe("asShareBatchAccess", () => {
  test("passes for the owner, a maintainer and a share holding the share right", async () => {
    const next = await call(
      asShareBatchAccess,
      `${ID.mine},${ID.managed},${ID.shared}`,
    )
    expect(next).toHaveBeenCalledWith()
    expect(model.conversations.getConvsListByIds).toHaveBeenCalledTimes(1)
    expect(model.organizations.getByIds).toHaveBeenCalledTimes(1)
  })

  test("refuses a share without the share right", async () => {
    const next = await call(asShareBatchAccess, `${ID.mine},${ID.sharedRead}`)
    expect(next.mock.calls[0][0]).toBeInstanceOf(ConversationShareAccessDenied)
  })

  test("refuses an unknown conversation explicitly", async () => {
    const next = await call(asShareBatchAccess, `${ID.mine},${ID.missing}`)
    expect(next.mock.calls[0][0]).toBeInstanceOf(ConversationNotShared)
  })

  test("refuses a conversation whose organization is gone", async () => {
    const next = await call(asShareBatchAccess, ID.orphan)
    expect(next.mock.calls[0][0]).toBeInstanceOf(ConversationShareAccessDenied)
  })

  test("requires a conversation list", async () => {
    const next = await call(asShareBatchAccess, "")
    expect(next.mock.calls[0][0]).toBeInstanceOf(ConversationIdRequire)
  })
})
