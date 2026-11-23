jest.mock("debug", () => () => () => {})
jest.mock(`${process.cwd()}/lib/mongodb/driver`, () => ({}))

const users = require(`${process.cwd()}/lib/mongodb/models/users`)

const PERSON = { provider: "twake", subject: "jdoe", email: "jdoe@twake.app" }

beforeEach(() => {
  jest.restoreAllMocks()
  jest.spyOn(users, "mongoRequest").mockResolvedValue([])
})

test("a person's keys are looked up in the given organization only", async () => {
  await users.findApiKeyOfPerson(PERSON, "root")
  const [query, options] = users.mongoRequest.mock.calls[0]
  expect(query).toEqual({
    type: "machine",
    "metadata.organizationId": "root",
    $or: [
      {
        "metadata.externalIdentity.provider": "twake",
        "metadata.externalIdentity.subject": "jdoe",
      },
      { "metadata.externalIdentity.email": "jdoe@twake.app" },
    ],
  })
  expect(options.sort).toEqual({ created: -1 })
})

test("no organization reads nothing", async () => {
  expect(await users.findApiKeyOfPerson(PERSON)).toEqual([])
  expect(users.mongoRequest).not.toHaveBeenCalled()
})
