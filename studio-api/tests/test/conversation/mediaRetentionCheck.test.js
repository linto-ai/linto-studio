// Periodic check deleting the media whose retention is over.

jest.mock("debug", () => () => () => {})
jest.mock(`${process.cwd()}/lib/logger/logger`, () => ({
  info: jest.fn(),
  error: jest.fn(),
}))

const mockListExpired = jest.fn()
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  conversations: { listExpired: (...args) => mockListExpired(...args) },
}))
const mockDeleteCascade = jest.fn()
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/organization/utility`,
  () => ({
    deleteConversationCascade: (...args) => mockDeleteCascade(...args),
  }),
)

const { deleteExpired, tick } = require(
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
  mockDeleteCascade.mockResolvedValue()
})

describe("deleteExpired", () => {
  test("deletes each expired media with what depends on it", async () => {
    mockListExpired.mockResolvedValue([media("a"), media("b")])

    const deleted = await deleteExpired()

    expect(deleted).toBe(2)
    expect(mockDeleteCascade).toHaveBeenCalledWith(media("a"))
    expect(mockDeleteCascade).toHaveBeenCalledWith(media("b"))
  })

  test("a media that cannot be deleted does not hold the others", async () => {
    mockListExpired.mockResolvedValue([media("a"), media("b")])
    mockDeleteCascade.mockRejectedValueOnce(new Error("already deleted"))

    const deleted = await deleteExpired()

    expect(deleted).toBe(1)
    expect(mockDeleteCascade).toHaveBeenCalledTimes(2)
  })

  test("fails when the list cannot be read", async () => {
    mockListExpired.mockResolvedValue(new Error("database down"))

    await expect(deleteExpired()).rejects.toThrow("database down")
    expect(mockDeleteCascade).not.toHaveBeenCalled()
  })
})

describe("tick", () => {
  test("goes on while batches come back full", async () => {
    mockListExpired
      .mockResolvedValueOnce(batch(100, "first"))
      .mockResolvedValueOnce(batch(3, "second"))

    await tick()

    expect(mockListExpired).toHaveBeenCalledTimes(2)
    expect(mockDeleteCascade).toHaveBeenCalledTimes(103)
  })

  test("stops on a batch that could not be fully deleted", async () => {
    mockListExpired.mockResolvedValue(batch(100, "stuck"))
    mockDeleteCascade.mockRejectedValue(new Error("storage down"))

    await tick()

    expect(mockListExpired).toHaveBeenCalledTimes(1)
  })

  test("a failed check leaves the next one free to run", async () => {
    mockListExpired
      .mockResolvedValueOnce(new Error("database down"))
      .mockResolvedValueOnce([media("a")])

    await tick()
    await tick()

    expect(mockDeleteCascade).toHaveBeenCalledTimes(1)
  })

  test("does not overlap a check still running", async () => {
    let release
    mockListExpired.mockReturnValueOnce(
      new Promise((resolve) => {
        release = () => resolve([])
      }),
    )

    const running = tick()
    await tick()
    release()
    await running

    expect(mockListExpired).toHaveBeenCalledTimes(1)
  })
})
