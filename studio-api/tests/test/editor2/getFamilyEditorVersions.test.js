const mockCollection = {
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

const conversationEditor = require(
  `${process.cwd()}/lib/mongodb/models/conversationEditor`,
)

function doc(id, editorVersion, childIds) {
  return {
    _id: { toString: () => id },
    ...(editorVersion !== undefined && { editorVersion }),
    ...(childIds && { type: { child_conversations: childIds } }),
  }
}

function mockFindReturning(docsPerCall) {
  let call = 0
  mockCollection.find.mockImplementation(() => ({
    toArray: async () => docsPerCall[call++] ?? [],
  }))
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe("conversationEditor.getFamilyEditorVersions", () => {
  test("walks parent → children → grandchildren, missing versions ≡ 0", async () => {
    mockCollection.findOne.mockResolvedValue(doc("parent", 2, ["ch-1", "ch-2"]))
    mockFindReturning([
      [doc("ch-1", 5, ["tr-1"]), doc("ch-2", undefined, [])],
      [doc("tr-1", 9)],
    ])

    const versions = await conversationEditor.getFamilyEditorVersions("parent")

    expect(versions).toEqual({ parent: 2, "ch-1": 5, "ch-2": 0, "tr-1": 9 })
  })

  test("a childless conversation returns just itself, one query", async () => {
    mockCollection.findOne.mockResolvedValue(doc("solo", 4))

    const versions = await conversationEditor.getFamilyEditorVersions("solo")

    expect(versions).toEqual({ solo: 4 })
    expect(mockCollection.find).not.toHaveBeenCalled()
  })

  test("an unknown conversation returns an empty map", async () => {
    mockCollection.findOne.mockResolvedValue(null)
    await expect(
      conversationEditor.getFamilyEditorVersions("ghost"),
    ).resolves.toEqual({})
  })
})
