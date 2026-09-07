const mockCollection = {
  findOneAndUpdate: jest.fn(),
  findOne: jest.fn(),
  deleteOne: jest.fn(),
  deleteMany: jest.fn(),
  find: jest.fn(),
}

jest.mock(`${process.cwd()}/lib/mongodb/driver`, () => ({
  constructor: { db: { collection: () => mockCollection } },
}))

const editorLocks = require(`${process.cwd()}/lib/mongodb/models/editorLocks`)

const LOCK_INPUT = {
  parentId: "conv-1",
  translationId: "tr-1",
  turnId: "turn-1",
  userId: "user-1",
  socketId: "sock-1",
  userName: "Marie Dupont",
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe("editorLocks.acquire", () => {
  test("a fresh acquisition upserts and reports refreshed=false", async () => {
    mockCollection.findOneAndUpdate.mockResolvedValue(null)

    const result = await editorLocks.acquire(LOCK_INPUT)

    expect(result).toEqual({ acquired: true, refreshed: false })
    const [filter, update, options] =
      mockCollection.findOneAndUpdate.mock.calls[0]
    expect(filter.translationId).toBe("tr-1")
    expect(filter.turnId).toBe("turn-1")
    // Re-acquirable when expired OR already mine.
    expect(filter.$or).toEqual([
      { socketId: "sock-1" },
      { expiresAt: { $lte: expect.any(Date) } },
    ])
    expect(update.$set.expiresAt.getTime()).toBeGreaterThan(Date.now())
    expect(options).toMatchObject({ upsert: true, returnDocument: "before" })
  })

  test("re-acquiring one's own lock reports refreshed=true (heartbeat)", async () => {
    mockCollection.findOneAndUpdate.mockResolvedValue({
      ...LOCK_INPUT,
      expiresAt: new Date(),
    })

    const result = await editorLocks.acquire(LOCK_INPUT)

    expect(result).toEqual({ acquired: true, refreshed: true })
  })

  test("taking over an expired lock of another socket is an acquisition, not a refresh", async () => {
    mockCollection.findOneAndUpdate.mockResolvedValue({
      ...LOCK_INPUT,
      socketId: "sock-9",
      expiresAt: new Date(0),
    })

    const result = await editorLocks.acquire(LOCK_INPUT)

    expect(result).toEqual({ acquired: true, refreshed: false })
  })

  test("a live lock held by another socket resolves to the holder", async () => {
    const duplicateKey = Object.assign(new Error("E11000"), { code: 11000 })
    mockCollection.findOneAndUpdate.mockRejectedValue(duplicateKey)
    mockCollection.findOne.mockResolvedValue({
      ...LOCK_INPUT,
      socketId: "sock-2",
      userId: "user-2",
      userName: "Thomas",
    })

    const result = await editorLocks.acquire(LOCK_INPUT)

    expect(result.acquired).toBe(false)
    expect(result.holder).toMatchObject({ userId: "user-2" })
  })

  test("a holder gone between the conflict and the read yields holder=null", async () => {
    const duplicateKey = Object.assign(new Error("E11000"), { code: 11000 })
    mockCollection.findOneAndUpdate.mockRejectedValue(duplicateKey)
    mockCollection.findOne.mockResolvedValue(null)

    const result = await editorLocks.acquire(LOCK_INPUT)

    expect(result).toEqual({ acquired: false, holder: null })
  })

  test("non-duplicate errors propagate", async () => {
    mockCollection.findOneAndUpdate.mockRejectedValue(new Error("mongo down"))
    await expect(editorLocks.acquire(LOCK_INPUT)).rejects.toThrow("mongo down")
  })
})

describe("editorLocks.isHeldBy", () => {
  test("true only for a LIVE lock of this socket (lazy expiry in the query)", async () => {
    mockCollection.findOne.mockResolvedValue({ ...LOCK_INPUT })
    await expect(editorLocks.isHeldBy("tr-1", "turn-1", "sock-1")).resolves.toBe(
      true,
    )
    expect(mockCollection.findOne).toHaveBeenCalledWith({
      translationId: "tr-1",
      turnId: "turn-1",
      socketId: "sock-1",
      expiresAt: { $gt: expect.any(Date) },
    })

    mockCollection.findOne.mockResolvedValue(null)
    await expect(editorLocks.isHeldBy("tr-1", "turn-1", "sock-1")).resolves.toBe(
      false,
    )
  })
})

describe("editorLocks.release", () => {
  test("only deletes the caller's own lock and reports whether it did", async () => {
    mockCollection.deleteOne.mockResolvedValue({ deletedCount: 1 })
    await expect(editorLocks.release("tr-1", "turn-1", "sock-1")).resolves.toBe(
      true,
    )
    expect(mockCollection.deleteOne).toHaveBeenCalledWith({
      translationId: "tr-1",
      turnId: "turn-1",
      socketId: "sock-1",
    })

    mockCollection.deleteOne.mockResolvedValue({ deletedCount: 0 })
    await expect(editorLocks.release("tr-1", "turn-1", "sock-1")).resolves.toBe(
      false,
    )
  })
})

describe("editorLocks.releaseAllForSocket", () => {
  test("returns the released documents for the unlock broadcasts", async () => {
    const locks = [{ parentId: "conv-1", translationId: "tr-1", turnId: "t1" }]
    mockCollection.find.mockReturnValue({
      toArray: jest.fn().mockResolvedValue(locks),
    })
    mockCollection.deleteMany.mockResolvedValue({ deletedCount: 1 })

    await expect(editorLocks.releaseAllForSocket("sock-1")).resolves.toEqual(
      locks,
    )
    expect(mockCollection.deleteMany).toHaveBeenCalledWith({
      socketId: "sock-1",
    })
  })

  test("scopes both the read and the delete to the parent when given", async () => {
    const locks = [{ parentId: "conv-1", translationId: "tr-1", turnId: "t1" }]
    mockCollection.find.mockReturnValue({
      toArray: jest.fn().mockResolvedValue(locks),
    })
    mockCollection.deleteMany.mockResolvedValue({ deletedCount: 1 })

    await editorLocks.releaseAllForSocket("sock-1", { parentId: "conv-1" })

    expect(mockCollection.find).toHaveBeenCalledWith({
      socketId: "sock-1",
      parentId: "conv-1",
    })
    expect(mockCollection.deleteMany).toHaveBeenCalledWith({
      socketId: "sock-1",
      parentId: "conv-1",
    })
  })

  test("skips the delete when the socket holds nothing", async () => {
    mockCollection.find.mockReturnValue({
      toArray: jest.fn().mockResolvedValue([]),
    })

    await expect(editorLocks.releaseAllForSocket("sock-1")).resolves.toEqual([])
    expect(mockCollection.deleteMany).not.toHaveBeenCalled()
  })
})
