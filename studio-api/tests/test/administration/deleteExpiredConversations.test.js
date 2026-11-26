// Backoffice route deleting the media whose retention is over, called on a
// schedule by the studio-tasks service.

jest.mock("debug", () => () => () => {})
jest.mock(`${process.cwd()}/lib/logger/logger`, () => ({
  error: jest.fn(),
}))
jest.mock(`${process.cwd()}/lib/logger/manager`, () => ({
  logRetentionEvent: jest.fn(),
}))
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  conversations: { listExpired: jest.fn() },
}))
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/organization/utility`,
  () => ({ deleteConversationCascade: jest.fn() }),
)

const LogManager = require(`${process.cwd()}/lib/logger/manager`)
const model = require(`${process.cwd()}/lib/mongodb/models`)
const { deleteConversationCascade } = require(
  `${process.cwd()}/components/WebServer/controllers/organization/utility`,
)
const { deleteExpiredConversations } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/administration/conversations`,
)

const media = (id) => ({
  _id: id,
  organization: { organizationId: "org-1" },
  expiresAt: "2020-01-01T00:00:00+00:00",
})
const batch = (size, prefix) =>
  Array.from({ length: size }, (_, index) => media(`${prefix}-${index}`))

const req = { payload: { data: { userId: "tasks-key" } } }

async function call() {
  const res = { status: jest.fn(() => res), send: jest.fn() }
  const next = jest.fn()
  await deleteExpiredConversations(req, res, next)
  return { res, next }
}

beforeEach(() => {
  jest.clearAllMocks()
  deleteConversationCascade.mockResolvedValue()
})

describe("deleteExpiredConversations", () => {
  test("deletes each expired media and writes it to the activity log", async () => {
    model.conversations.listExpired.mockResolvedValue([media("a"), media("b")])

    const { res } = await call()

    expect(deleteConversationCascade).toHaveBeenCalledWith(media("a"))
    expect(deleteConversationCascade).toHaveBeenCalledWith(media("b"))
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({ deleted: 2, failed: 0 }),
    )
    expect(LogManager.logRetentionEvent).toHaveBeenCalledWith(req, media("a"))
    expect(LogManager.logRetentionEvent).toHaveBeenCalledWith(req, media("b"))
  })

  test("a media that cannot be deleted does not hold the others", async () => {
    model.conversations.listExpired.mockResolvedValue([media("a"), media("b")])
    deleteConversationCascade.mockRejectedValueOnce(new Error("storage down"))

    const { res } = await call()

    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({ deleted: 1, failed: 1 }),
    )
    expect(LogManager.logRetentionEvent).toHaveBeenCalledTimes(1)
    expect(LogManager.logRetentionEvent).toHaveBeenCalledWith(req, media("b"))
  })

  test("goes on while batches come back full", async () => {
    model.conversations.listExpired
      .mockResolvedValueOnce(batch(100, "first"))
      .mockResolvedValueOnce(batch(3, "second"))

    const { res } = await call()

    expect(model.conversations.listExpired).toHaveBeenCalledTimes(2)
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({ deleted: 103, failed: 0 }),
    )
  })

  test("stops on a batch that could not be fully deleted", async () => {
    model.conversations.listExpired.mockResolvedValue(batch(100, "stuck"))
    deleteConversationCascade.mockRejectedValue(new Error("storage down"))

    const { res } = await call()

    expect(model.conversations.listExpired).toHaveBeenCalledTimes(1)
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({ deleted: 0, failed: 100 }),
    )
  })

  test("fails when the list cannot be read", async () => {
    model.conversations.listExpired.mockResolvedValue(
      new Error("database down"),
    )

    const { res, next } = await call()

    expect(next.mock.calls[0][0].message).toBe("database down")
    expect(res.send).not.toHaveBeenCalled()
    expect(deleteConversationCascade).not.toHaveBeenCalled()
  })
})
