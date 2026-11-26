// A conversation created with deleteOnFetch is only reached by its id: the
// listings and the counts shown next to them leave it out.

const mockAggregate = jest.fn(() => ({ toArray: async () => [] }))

jest.mock(`${process.cwd()}/lib/mongodb/driver`, () => ({
  constructor: {
    db: { collection: () => ({ aggregate: mockAggregate }) },
    mongoDb: { ObjectId: require("bson").ObjectId },
  },
}))

const conversations = require(
  `${process.cwd()}/lib/mongodb/models/conversations`,
)
const folders = require(`${process.cwd()}/lib/mongodb/models/folders`)
const tags = require(`${process.cwd()}/lib/mongodb/models/tags`)
const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const RIGHTS = require(`${process.cwd()}/lib/dao/conversation/rights`)

const CONV = "507f1f77bcf86cd799439011"
const ORG = "507f1f77bcf86cd799439012"
const CATEGORY = "507f1f77bcf86cd799439013"
const NOT_DELETED_ON_FETCH = { $ne: true }

let find
let paginate

beforeEach(() => {
  mockAggregate.mockClear()
  find = jest.spyOn(conversations, "mongoRequest").mockResolvedValue([])
  paginate = jest
    .spyOn(conversations, "mongoAggregatePaginate")
    .mockResolvedValue({ list: [], count: 0 })
})

afterEach(() => jest.restoreAllMocks())

describe("listings of conversations", () => {
  test("the conversations of an organization", async () => {
    await conversations.listConvFromOrga(ORG, "user-1", ROLES.MEMBER, 1, {})

    expect(paginate.mock.calls[0][0].deleteOnFetch).toEqual(
      NOT_DELETED_ON_FETCH,
    )
  })

  test("the conversations being processed, watched for the interface", async () => {
    await conversations.listProcessingConversations(ORG)

    expect(find.mock.calls[0][0].deleteOnFetch).toEqual(NOT_DELETED_ON_FETCH)
  })

  test("the conversations shared with a user", async () => {
    await conversations.getByShare("user-1")
    await conversations.getByShare("user-1", { name: "meeting" })

    expect(find.mock.calls[0][0].deleteOnFetch).toEqual(NOT_DELETED_ON_FETCH)
    expect(paginate.mock.calls[0][0].deleteOnFetch).toEqual(
      NOT_DELETED_ON_FETCH,
    )
  })

  test("the favorites of a user", async () => {
    await conversations.listConvFromFavorite([CONV], {})

    expect(paginate.mock.calls[0][0].deleteOnFetch).toEqual(
      NOT_DELETED_ON_FETCH,
    )
  })
})

describe("counts of conversations", () => {
  test("the conversations of a folder", async () => {
    await folders.countConversationsByFolderIds(
      ["folder-1"],
      ORG,
      "user-1",
      ROLES.MEMBER,
    )

    const [pipeline] = mockAggregate.mock.calls[0]
    expect(pipeline[0].$match.deleteOnFetch).toEqual(NOT_DELETED_ON_FETCH)
  })

  test("the medias of a tag", async () => {
    jest.spyOn(tags, "mongoRequest").mockResolvedValue([{ _id: "tag-1" }])

    await tags.getByOrgAndCategoryId(ORG, CATEGORY, true)

    const [pipeline] = mockAggregate.mock.calls[0]
    expect(pipeline[0].$match.deleteOnFetch).toEqual(NOT_DELETED_ON_FETCH)
  })
})

describe("a conversation created with deleteOnFetch stays reachable", () => {
  test("by its id, to be deleted without being fetched", async () => {
    await conversations.listConvFromConvIds(
      [CONV],
      ORG,
      "user-1",
      ROLES.MAINTAINER,
      RIGHTS.DELETE,
    )

    expect(paginate.mock.calls[0][0]).not.toHaveProperty("deleteOnFetch")
  })

  test("by the backoffice total of an organization, an index-only count", async () => {
    await conversations.countMediaFromOrga([ORG])

    const [pipeline] = mockAggregate.mock.calls[0]
    expect(pipeline[0].$match).not.toHaveProperty("deleteOnFetch")
  })

  test("by its organization, to be deleted along with it", async () => {
    await conversations.getByOrga(ORG)

    expect(find.mock.calls[0][0]).not.toHaveProperty("deleteOnFetch")
  })
})
