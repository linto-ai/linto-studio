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

// The last_update string the model wrote, whether the update is an operator
// document or a pipeline (last stage carries it).
function writtenLastUpdate() {
  const [, update] = mockCollection.findOneAndUpdate.mock.calls[0]
  const stages = Array.isArray(update) ? update : [update]
  return stages[stages.length - 1].$set.last_update
}

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
      true,
    )

    expect(result).toEqual({
      version: 6,
      lastUpdate: writtenLastUpdate(),
      previousName: "Marie",
      // No flag in the pre-image (legacy data): a real name.
      previousDefined: true,
      undoHead: "rev-0",
    })
    const [, update, options] = mockCollection.findOneAndUpdate.mock.calls[0]
    expect(update.$set["speakers.$.defined"]).toBe(true)
    expect(options.returnDocument).toBe("before")
  })

  test("writes the given defined flag and returns the placeholder's previous one", async () => {
    mockCollection.findOneAndUpdate.mockResolvedValue({
      editorVersion: 5,
      speakers: [{ speaker_id: "spk-1", speaker_name: "Marie", defined: true }],
    })

    // An undo bringing back a placeholder name passes defined false.
    const undo = await conversationEditor.renameEditorSpeaker(
      "conv-1",
      "spk-1",
      "spk2",
      false,
    )
    const [, update] = mockCollection.findOneAndUpdate.mock.calls[0]
    expect(update.$set["speakers.$.speaker_name"]).toBe("spk2")
    expect(update.$set["speakers.$.defined"]).toBe(false)
    expect(undo.previousDefined).toBe(true)

    mockCollection.findOneAndUpdate.mockResolvedValue({
      speakers: [{ speaker_id: "spk-1", speaker_name: "spk2", defined: false }],
    })
    const rename = await conversationEditor.renameEditorSpeaker(
      "conv-1",
      "spk-1",
      "Marie",
      true,
    )
    expect(rename.previousDefined).toBe(false)
  })

  test("missing editorVersion/undoHead default to 0/null", async () => {
    mockCollection.findOneAndUpdate.mockResolvedValue({
      speakers: [{ speaker_id: "spk-1", speaker_name: "Marie" }],
    })

    const result = await conversationEditor.renameEditorSpeaker(
      "conv-1",
      "spk-1",
      "Marie D.",
      true,
    )

    expect(result).toEqual({
      version: 1,
      lastUpdate: writtenLastUpdate(),
      previousName: "Marie",
      previousDefined: true,
      undoHead: null,
    })
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
        { speaker_id: "spk-1", speaker_name: "spk1", defined: false },
        { speaker_id: "spk-2", speaker_name: "Thomas" },
      ],
      undoHead: "rev-0",
    })

    // A stale copy (e.g. from a revision): the stored entry wins.
    const result = await conversationEditor.updateEditorTurnSpeaker(
      "conv-1",
      "turn-2",
      { speaker_id: "spk-1", speaker_name: "Marie", defined: true },
    )

    expect(result).toEqual({
      version: 10,
      lastUpdate: writtenLastUpdate(),
      previousSpeaker: { speaker_id: "spk-2", speaker_name: "Thomas" },
      assignedSpeaker: {
        speaker_id: "spk-1",
        speaker_name: "spk1",
        defined: false,
      },
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
      lastUpdate: writtenLastUpdate(),
      previousSpeaker: { speaker_id: "spk-2", speaker_name: "Thomas" },
      // Absent from the pre-image: the inserted speaker itself.
      assignedSpeaker: { speaker_id: "spk-1", speaker_name: "Marie" },
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
      lastUpdate: writtenLastUpdate(),
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
