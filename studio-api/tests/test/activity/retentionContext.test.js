// Activity log entry of a media deleted because its retention is over.

jest.mock("debug", () => () => () => {})
jest.mock(`${process.cwd()}/lib/utility/axios`, () => ({}))
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  users: {
    getById: jest.fn(async () => [
      { firstname: "Tasks", lastname: "", email: "tasks@machine" },
    ]),
  },
  organizations: {
    getById: jest.fn(async () => [{ name: "Organization", description: "" }]),
  },
}))

const model = require(`${process.cwd()}/lib/mongodb/models`)
const context = require(`${process.cwd()}/lib/logger/context`)

const req = {
  method: "DELETE",
  originalUrl: "/api/administration/conversations/expired",
  url: "/conversations/expired",
  res: { statusCode: 200 },
  payload: { data: { userId: "tasks-key", role: 9 } },
}
const conversation = {
  _id: "conv-1",
  name: "Weekly meeting",
  organization: { organizationId: "org-1" },
  expiresAt: "2020-01-01T00:00:00+00:00",
}

describe("createRetentionContext", () => {
  test("lists the deletion with the activity of the organization of the media", async () => {
    const ctx = await context.createRetentionContext(req, conversation)

    expect(ctx).toMatchObject({
      source: "webserver",
      level: "info",
      scope: "resource",
      activity: "retention",
      message:
        "Media conv-1 deleted: retention over since 2020-01-01T00:00:00+00:00",
      user: { id: "tasks-key" },
      organization: { id: "org-1", info: { name: "Organization" } },
      retention: {
        conversationId: "conv-1",
        name: "Weekly meeting",
        expiresAt: "2020-01-01T00:00:00+00:00",
      },
      http: {
        method: "DELETE",
        url: "/api/administration/conversations/expired",
      },
    })
  })

  test("an organization that cannot be read gives an error entry", async () => {
    model.organizations.getById.mockResolvedValueOnce([])

    const ctx = await context.createRetentionContext(req, {
      ...conversation,
      organization: { organizationId: "org-gone" },
    })

    expect(ctx).toMatchObject({ source: "system", level: "error" })
  })
})
