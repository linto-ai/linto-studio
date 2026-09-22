jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  conversations: { getById: jest.fn(), update: jest.fn() },
}))
jest.mock(`${process.cwd()}/lib/mailer/mailing`, () => ({}))
for (const dep of [
  "controllers/conversation/utility",
  "controllers/conversation/child",
]) {
  jest.mock(`${process.cwd()}/components/WebServer/${dep}`, () => ({
    updateChildConversation: jest.fn(),
  }))
}

const model = require(`${process.cwd()}/lib/mongodb/models`)
const { updateChildConversation } = require(
  `${process.cwd()}/components/WebServer/controllers/conversation/child`,
)
const { updateConversationMembersRight } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/conversation/share`,
)

async function patch(body) {
  const req = {
    params: { conversationId: "conv-1" },
    payload: { data: { userId: "sharer" } },
    body,
  }
  const res = { status: jest.fn(() => res), send: jest.fn() }
  const next = jest.fn()
  await updateConversationMembersRight(req, res, next)
  return { res, next }
}

beforeEach(() => {
  jest.clearAllMocks()
  model.conversations.getById.mockResolvedValue([
    {
      _id: "conv-1",
      organization: { organizationId: "org", membersRight: 1 },
      type: { child_conversations: [] },
    },
  ])
  model.conversations.update.mockResolvedValue({ matchedCount: 1 })
})

describe("updateConversationMembersRight", () => {
  test("writes the members right only", async () => {
    const { res } = await patch({ membersRight: 0, name: "hacked" })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(model.conversations.update).toHaveBeenCalledWith({
      _id: "conv-1",
      "organization.membersRight": 0,
    })
    expect(updateChildConversation).not.toHaveBeenCalled()
  })

  test("rejects an invalid right", async () => {
    const { next } = await patch({ membersRight: 99 })
    expect(next).toHaveBeenCalledWith(expect.any(Error))
    expect(model.conversations.update).not.toHaveBeenCalled()
  })

  test("propagates the right to child conversations", async () => {
    model.conversations.getById.mockResolvedValue([
      {
        _id: "conv-1",
        organization: { organizationId: "org", membersRight: 1 },
        type: { child_conversations: ["child-1"] },
      },
    ])
    await patch({ membersRight: 3 })
    expect(updateChildConversation).toHaveBeenCalledWith(
      expect.objectContaining({
        organization: expect.objectContaining({ membersRight: 3 }),
      }),
      "RIGHTS",
    )
  })
})
