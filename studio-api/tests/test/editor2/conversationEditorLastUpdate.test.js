const mockCollection = {
  findOneAndUpdate: jest.fn(),
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

const PRE_IMAGE = {
  editorVersion: 3,
  text: [
    { turn_id: "turn-1", speaker_id: "spk-1" },
    { turn_id: "turn-2", speaker_id: "spk-2" },
  ],
  speakers: [
    { speaker_id: "spk-1", speaker_name: "Marie" },
    { speaker_id: "spk-2", speaker_name: "Thomas" },
  ],
  undoHead: null,
}

// Every mutating method returns the exact last_update it wrote, so the
// broadcast can carry it (clients compare it with AI report timestamps).
describe.each([
  [
    "updateEditorTurn",
    () =>
      conversationEditor.updateEditorTurn("conv-1", "turn-1", {
        segment: "bonjour",
        words: [],
      }),
  ],
  [
    "splitEditorTurn",
    () =>
      conversationEditor.splitEditorTurn(
        "conv-1",
        "turn-1",
        { turn_id: "turn-1" },
        { turn_id: "turn-1b" },
      ),
  ],
  [
    "mergeEditorTurns",
    () =>
      conversationEditor.mergeEditorTurns("conv-1", "turn-1", "turn-2", {
        turn_id: "turn-1",
      }),
  ],
  [
    "updateEditorTurnSpeaker",
    () =>
      conversationEditor.updateEditorTurnSpeaker("conv-1", "turn-2", {
        speaker_id: "spk-1",
        speaker_name: "Marie",
      }),
  ],
  [
    "deleteEditorTurn",
    () => conversationEditor.deleteEditorTurn("conv-1", "turn-2"),
  ],
  [
    "renameEditorSpeaker",
    () => conversationEditor.renameEditorSpeaker("conv-1", "spk-1", "Marie D."),
  ],
  [
    "replaceEditorSpeaker",
    () => conversationEditor.replaceEditorSpeaker("conv-1", "spk-1", "spk-2"),
  ],
  [
    "restoreReplacedSpeaker",
    () =>
      conversationEditor.restoreReplacedSpeaker(
        "conv-1",
        { speaker_id: "spk-1", speaker_name: "Marie" },
        "spk-2",
        ["turn-1"],
      ),
  ],
])("conversationEditor.%s", (_name, run) => {
  test("returns the last_update it wrote", async () => {
    mockCollection.findOneAndUpdate.mockResolvedValue(PRE_IMAGE)

    const result = await run()

    const written = writtenLastUpdate()
    expect(typeof written).toBe("string")
    expect(Number.isNaN(Date.parse(written))).toBe(false)
    expect(result.lastUpdate).toBe(written)
  })

  test("null (no lastUpdate) when nothing was written", async () => {
    mockCollection.findOneAndUpdate.mockResolvedValue(null)

    await expect(run()).resolves.toBeNull()
  })
})
