// Periodic check deleting the media whose retention is over.

jest.mock("debug", () => () => () => {})
jest.mock(`${process.cwd()}/lib/logger/logger`, () => ({
  info: jest.fn(),
  error: jest.fn(),
}))

jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  conversations: { listExpired: jest.fn() },
}))
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/organization/utility`,
  () => ({ deleteConversationCascade: jest.fn() }),
)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const { deleteConversationCascade } = require(
  `${process.cwd()}/components/WebServer/controllers/organization/utility`,
)
const { tick } = require(
  `${process.cwd()}/components/WebServer/controllers/conversation/retention`,
)

const media = (id) => ({
  _id: id,
  organization: { organizationId: "org-1" },
  expiresAt: "2020-01-01T00:00:00+00:00",
})
const batch = (size, prefix) =>
  Array.from({ length: size }, (_, index) => media(`${prefix}-${index}`))

beforeEach(() => {
  jest.clearAllMocks()
  deleteConversationCascade.mockResolvedValue()
})

describe("media retention check", () => {
  test("deletes each expired media with what depends on it", async () => {
    model.conversations.listExpired.mockResolvedValue([media("a"), media("b")])

    await tick()

    expect(deleteConversationCascade).toHaveBeenCalledWith(media("a"))
    expect(deleteConversationCascade).toHaveBeenCalledWith(media("b"))
  })

  test("a media that cannot be deleted does not hold the others", async () => {
    model.conversations.listExpired.mockResolvedValue([media("a"), media("b")])
    deleteConversationCascade.mockRejectedValueOnce(
      new Error("already deleted"),
    )

    await tick()

    expect(deleteConversationCascade).toHaveBeenCalledTimes(2)
  })

  test("deletes nothing when the list cannot be read", async () => {
    model.conversations.listExpired.mockResolvedValue(
      new Error("database down"),
    )

    await tick()

    expect(deleteConversationCascade).not.toHaveBeenCalled()
  })

  test("goes on while batches come back full", async () => {
    model.conversations.listExpired
      .mockResolvedValueOnce(batch(100, "first"))
      .mockResolvedValueOnce(batch(3, "second"))

    await tick()

    expect(model.conversations.listExpired).toHaveBeenCalledTimes(2)
    expect(deleteConversationCascade).toHaveBeenCalledTimes(103)
  })

  test("stops on a batch that could not be fully deleted", async () => {
    model.conversations.listExpired.mockResolvedValue(batch(100, "stuck"))
    deleteConversationCascade.mockRejectedValue(new Error("storage down"))

    await tick()

    expect(model.conversations.listExpired).toHaveBeenCalledTimes(1)
  })

  test("a failed check leaves the next one free to run", async () => {
    model.conversations.listExpired
      .mockResolvedValueOnce(new Error("database down"))
      .mockResolvedValueOnce([media("a")])

    await tick()
    await tick()

    expect(deleteConversationCascade).toHaveBeenCalledTimes(1)
  })

  test("does not overlap a check still running", async () => {
    let release
    model.conversations.listExpired.mockReturnValueOnce(
      new Promise((resolve) => {
        release = () => resolve([])
      }),
    )

    const running = tick()
    await tick()
    release()
    await running

    expect(model.conversations.listExpired).toHaveBeenCalledTimes(1)
  })
})
