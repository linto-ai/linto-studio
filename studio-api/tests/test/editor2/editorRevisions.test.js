const mockCollection = {
  findOneAndUpdate: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
}

jest.mock(`${process.cwd()}/lib/mongodb/driver`, () => ({
  constructor: {
    db: { collection: () => mockCollection },
    mongoDb: {
      ObjectId: class MockObjectId {
        constructor(id) {
          this.id = String(id)
        }
        toString() {
          return this.id
        }
      },
    },
  },
}))

const editorRevisions = require(
  `${process.cwd()}/lib/mongodb/models/editorRevisions`,
)

beforeEach(() => {
  jest.clearAllMocks()
})

describe("editorRevisions.insert", () => {
  test("upserts by the caller-provided id, stamping `at` server-side via $currentDate", async () => {
    await editorRevisions.insert({
      _id: "rev-1",
      translationId: "tr-1",
      parentId: "conv-1",
      type: "rename_speaker",
      before: { speakerId: "spk-1", name: "Marie" },
      after: { speakerId: "spk-1", name: "Marie D." },
      previousHead: null,
      author: { userId: "user-1", userName: "Marie Dupont" },
    })

    expect(mockCollection.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "rev-1" },
      {
        $set: {
          translationId: "tr-1",
          parentId: "conv-1",
          type: "rename_speaker",
          before: { speakerId: "spk-1", name: "Marie" },
          after: { speakerId: "spk-1", name: "Marie D." },
          previousHead: null,
          author: { userId: "user-1", userName: "Marie Dupont" },
        },
        $currentDate: { at: true },
      },
      { upsert: true },
    )
  })
})

describe("editorRevisions.findByPreviousHead", () => {
  test("sorts by (at, _id) descending and takes the most recent match", async () => {
    const next = jest.fn().mockResolvedValue({ _id: "rev-3" })
    const limit = jest.fn(() => ({ next }))
    const sort = jest.fn(() => ({ limit }))
    mockCollection.find.mockReturnValue({ sort })

    const result = await editorRevisions.findByPreviousHead("tr-1", "rev-0")

    expect(mockCollection.find).toHaveBeenCalledWith({
      translationId: "tr-1",
      previousHead: "rev-0",
    })
    expect(sort).toHaveBeenCalledWith({ at: -1, _id: -1 })
    expect(limit).toHaveBeenCalledWith(1)
    expect(result).toEqual({ _id: "rev-3" })
  })

  test("accepts null (the start-of-history cursor) as a previousHead value", async () => {
    const next = jest.fn().mockResolvedValue(null)
    mockCollection.find.mockReturnValue({ sort: () => ({ limit: () => ({ next }) }) })

    const result = await editorRevisions.findByPreviousHead("tr-1", null)

    expect(mockCollection.find).toHaveBeenCalledWith({
      translationId: "tr-1",
      previousHead: null,
    })
    expect(result).toBeNull()
  })
})
