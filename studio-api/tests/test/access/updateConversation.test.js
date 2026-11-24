jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  conversations: { getById: jest.fn(), update: jest.fn() },
}))
for (const dep of [
  "controllers/conversation/utility",
  "controllers/user/utility",
  "controllers/conversation/child",
  "controllers/organization/utility",
  "controllers/job/fetchHandler",
]) {
  jest.mock(`${process.cwd()}/components/WebServer/${dep}`, () => ({}))
}

const model = require(`${process.cwd()}/lib/mongodb/models`)
const { updateConversation } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/conversation/conversation`,
)

async function patch(body) {
  const req = {
    params: { conversationId: "conv-1" },
    payload: { data: { userId: "writer" } },
    body,
  }
  const res = { status: jest.fn(() => res), send: jest.fn() }
  const next = jest.fn()
  await updateConversation(req, res, next)
  return { res, next }
}

beforeEach(() => {
  jest.clearAllMocks()
  model.conversations.getById.mockResolvedValue([{ _id: "conv-1" }])
  model.conversations.update.mockResolvedValue({ matchedCount: 1 })
})

describe("updateConversation protected fields", () => {
  test("content fields are written", async () => {
    const { res } = await patch({ name: "New", description: "Desc" })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(model.conversations.update).toHaveBeenCalledWith({
      _id: "conv-1",
      name: "New",
      description: "Desc",
    })
  })

  test("rights, organization and security level are accepted but not written", async () => {
    const { res } = await patch({
      name: "New",
      owner: "writer",
      sharedWithUsers: [{ userId: "writer", right: 31 }],
      organization: { organizationId: "mine", customRights: [] },
      "organization.customRights": [{ userId: "writer", right: 31 }],
      "organization.membersRight": 31,
      "organization.organizationId": "mine",
      securityLevel: 0,
      "metadata.audio.filepath": "../../etc/passwd",
      metadata: { audio: { filepath: "../../etc/passwd" } },
      jobs: { transcription: { state: "done" } },
      type: { mode: "child" },
      _id: "other",
    })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(model.conversations.update).toHaveBeenCalledWith({
      _id: "conv-1",
      name: "New",
    })
  })
})

describe("updateConversation expiresAt", () => {
  const moment = require("moment")
  const inOneYear = moment().add(1, "year")

  test("a date to come is stored in the format of the other dates", async () => {
    const { res } = await patch({ expiresAt: inOneYear.toISOString() })

    expect(res.status).toHaveBeenCalledWith(200)
    expect(model.conversations.update).toHaveBeenCalledWith({
      _id: "conv-1",
      expiresAt: inOneYear.format(),
    })
  })

  test("null removes the date", async () => {
    const { res } = await patch({ expiresAt: null })

    expect(res.status).toHaveBeenCalledWith(200)
    expect(model.conversations.update).toHaveBeenCalledWith({
      _id: "conv-1",
      expiresAt: null,
    })
  })

  test.each([
    ["a past date", moment().subtract(1, "day").toISOString()],
    ["something that is not a date", "next year"],
    ["an empty value", ""],
    ["a number", 1893456000000],
  ])("%s is refused without updating", async (_label, expiresAt) => {
    const { next } = await patch({ name: "New", expiresAt })

    expect(next.mock.calls[0][0]).toMatchObject({ status: 400 })
    expect(model.conversations.update).not.toHaveBeenCalled()
  })

  test("a child conversation has no date of its own", async () => {
    model.conversations.getById.mockResolvedValue([
      { _id: "conv-1", type: { mode: "child" } },
    ])

    const { next } = await patch({ expiresAt: inOneYear.toISOString() })

    expect(next.mock.calls[0][0]).toMatchObject({ status: 400 })
    expect(model.conversations.update).not.toHaveBeenCalled()
  })

  test("an update of another field leaves the date as is", async () => {
    await patch({ name: "New" })

    expect(model.conversations.update).toHaveBeenCalledWith({
      _id: "conv-1",
      name: "New",
    })
  })
})
