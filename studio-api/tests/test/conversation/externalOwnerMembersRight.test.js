jest.mock("debug", () => () => () => {})
jest.mock(`${process.cwd()}/lib/mongodb/driver`, () => ({}))

const conversations = require(
  `${process.cwd()}/lib/mongodb/models/conversations`,
)
const users = require(`${process.cwd()}/lib/mongodb/models/users`)

const KEY = "aaaaaaaaaaaaaaaaaaaaaaaa"
const HUMAN = "cccccccccccccccccccccccc"

beforeEach(() => {
  jest.restoreAllMocks()
  jest.spyOn(conversations, "mongoInsert").mockResolvedValue({
    insertedId: "c1",
  })
  jest.spyOn(users, "getByIdFilter").mockImplementation(async (id) =>
    id === KEY
      ? [
          {
            _id: KEY,
            type: "machine",
            metadata: { externalIdentity: { provider: "twake", subject: "x" } },
          },
        ]
      : [{ _id: id, type: "user", metadata: {} }],
  )
})

const create = (owner, membersRight) =>
  conversations.create({
    owner,
    organization: { organizationId: "root", membersRight, customRights: [] },
  })
const inserted = () => conversations.mongoInsert.mock.calls[0][0]

test("a conversation owned by an external key is never given to the members", async () => {
  await create(KEY, 3)
  expect(inserted().organization.membersRight).toBe(0)
})

test("a conversation owned by anyone else keeps its members right", async () => {
  await create(HUMAN, 3)
  expect(inserted().organization.membersRight).toBe(3)
})

test("nothing is read when no right is given to the members", async () => {
  await create(KEY, 0)
  expect(users.getByIdFilter).not.toHaveBeenCalled()
  expect(inserted().organization.membersRight).toBe(0)
})
