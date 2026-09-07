const mockCollection = {
  findOneAndUpdate: jest.fn(),
  updateOne: jest.fn(),
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

beforeEach(() => {
  jest.clearAllMocks()
})

describe("conversationEditor.renameEditorSpeaker", () => {
  test("captures the previous name and undo head from the pre-image, computes version arithmetically", async () => {
    mockCollection.findOneAndUpdate.mockResolvedValue({
      editorVersion: 5,
      speakers: [{ speaker_id: "spk-1", speaker_name: "Marie" }],
      undoHead: "rev-0",
    })

    const result = await conversationEditor.renameEditorSpeaker(
      "conv-1",
      "spk-1",
      "Marie D.",
    )

    expect(result).toEqual({
      version: 6,
      previousName: "Marie",
      undoHead: "rev-0",
    })
    const [, , options] = mockCollection.findOneAndUpdate.mock.calls[0]
    expect(options.returnDocument).toBe("before")
  })

  test("missing editorVersion/undoHead default to 0/null", async () => {
    mockCollection.findOneAndUpdate.mockResolvedValue({
      speakers: [{ speaker_id: "spk-1", speaker_name: "Marie" }],
    })

    const result = await conversationEditor.renameEditorSpeaker(
      "conv-1",
      "spk-1",
      "Marie D.",
    )

    expect(result).toEqual({ version: 1, previousName: "Marie", undoHead: null })
  })

  test("null when the conversation or speaker no longer exists", async () => {
    mockCollection.findOneAndUpdate.mockResolvedValue(null)
    await expect(
      conversationEditor.renameEditorSpeaker("conv-1", "spk-404", "X"),
    ).resolves.toBeNull()
  })
})

describe("conversationEditor.updateEditorTurnSpeaker", () => {
  test("captures the turn's previous speaker and undo head from the pre-image atomically", async () => {
    mockCollection.findOneAndUpdate.mockResolvedValue({
      editorVersion: 9,
      text: [
        { turn_id: "turn-1", speaker_id: "spk-1" },
        { turn_id: "turn-2", speaker_id: "spk-2" },
      ],
      speakers: [
        { speaker_id: "spk-1", speaker_name: "Marie" },
        { speaker_id: "spk-2", speaker_name: "Thomas" },
      ],
      undoHead: "rev-0",
    })

    const result = await conversationEditor.updateEditorTurnSpeaker(
      "conv-1",
      "turn-2",
      { speaker_id: "spk-1", speaker_name: "Marie" },
    )

    expect(result).toEqual({
      version: 10,
      previousSpeaker: { speaker_id: "spk-2", speaker_name: "Thomas" },
      undoHead: "rev-0",
    })
    const [, , options] = mockCollection.findOneAndUpdate.mock.calls[0]
    expect(options.returnDocument).toBe("before")
  })

  test("missing editorVersion/undoHead default to 0/null", async () => {
    mockCollection.findOneAndUpdate.mockResolvedValue({
      text: [{ turn_id: "turn-2", speaker_id: "spk-2" }],
      speakers: [{ speaker_id: "spk-2", speaker_name: "Thomas" }],
    })

    const result = await conversationEditor.updateEditorTurnSpeaker(
      "conv-1",
      "turn-2",
      { speaker_id: "spk-1", speaker_name: "Marie" },
    )

    expect(result).toEqual({
      version: 1,
      previousSpeaker: { speaker_id: "spk-2", speaker_name: "Thomas" },
      undoHead: null,
    })
  })

  test("null when the conversation or turn no longer exists", async () => {
    mockCollection.findOneAndUpdate.mockResolvedValue(null)
    await expect(
      conversationEditor.updateEditorTurnSpeaker("conv-1", "turn-404", {
        speaker_id: "spk-1",
        speaker_name: "Marie",
      }),
    ).resolves.toBeNull()
  })
})

describe("conversationEditor.replaceEditorSpeaker", () => {
  test("captures fromSpeaker, the exact affected turnIds, and undoHead from the pre-image atomically", async () => {
    mockCollection.findOneAndUpdate.mockResolvedValue({
      editorVersion: 6,
      text: [
        { turn_id: "turn-1", speaker_id: "spk-1" },
        { turn_id: "turn-2", speaker_id: "spk-2" },
        { turn_id: "turn-3", speaker_id: "spk-1" },
      ],
      speakers: [
        { speaker_id: "spk-1", speaker_name: "Marie" },
        { speaker_id: "spk-2", speaker_name: "Thomas" },
      ],
      undoHead: "rev-0",
    })

    const result = await conversationEditor.replaceEditorSpeaker(
      "conv-1",
      "spk-1",
      "spk-2",
    )

    expect(result).toEqual({
      version: 7,
      fromSpeaker: { speaker_id: "spk-1", speaker_name: "Marie" },
      turnIds: ["turn-1", "turn-3"],
      undoHead: "rev-0",
    })
    const [, , options] = mockCollection.findOneAndUpdate.mock.calls[0]
    expect(options.returnDocument).toBe("before")
  })

  test("null when the conversation or either speaker no longer exists", async () => {
    mockCollection.findOneAndUpdate.mockResolvedValue(null)
    await expect(
      conversationEditor.replaceEditorSpeaker("conv-1", "spk-404", "spk-2"),
    ).resolves.toBeNull()
  })
})

describe("conversationEditor.swapConversationUndoHead", () => {
  test("true when the current head still matches currentHead", async () => {
    mockCollection.updateOne.mockResolvedValue({ matchedCount: 1 })

    const ok = await conversationEditor.swapConversationUndoHead(
      "conv-1",
      "rev-1",
      "rev-0",
    )

    expect(ok).toBe(true)
    const [filter, update] = mockCollection.updateOne.mock.calls[0]
    expect(filter.undoHead).toBe("rev-1")
    expect(update).toEqual({ $set: { undoHead: "rev-0" } })
  })

  test("false when the head already moved (stale undo, or concurrent undo of the same revision)", async () => {
    mockCollection.updateOne.mockResolvedValue({ matchedCount: 0 })

    const ok = await conversationEditor.swapConversationUndoHead(
      "conv-1",
      "rev-1",
      "rev-0",
    )

    expect(ok).toBe(false)
  })
})
