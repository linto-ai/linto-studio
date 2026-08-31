jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  conversationEditor: {
    renameEditorSpeaker: jest.fn(),
    updateEditorTurnSpeaker: jest.fn(),
    restoreReplacedSpeaker: jest.fn(),
    swapConversationUndoHead: jest.fn(),
  },
  editorRevisions: {
    findById: jest.fn(),
    getObjectId: jest.fn((id) => `oid:${id}`),
  },
}))

const model = require(`${process.cwd()}/lib/mongodb/models`)
const { onUndo } = require(`${process.cwd()}/components/EditorHandler/handlers/onUndo`)

function makeCtx() {
  const emit = jest.fn()
  return {
    emit,
    io: { to: jest.fn(() => ({ emit })) },
    socket: {
      data: {
        editorUser: { userId: "user-1", userName: "Marie Dupont" },
        editorParentId: "conv-1",
      },
    },
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  model.editorRevisions.getObjectId.mockImplementation((id) => `oid:${id}`)
})

test("rejects a malformed or missing revisionId", async () => {
  const ctx = makeCtx()
  const ack1 = jest.fn()
  await onUndo(ctx, { translationId: "tr-1" }, ack1)
  expect(ack1).toHaveBeenCalledWith({ ok: false, reason: "invalid_payload" })

  model.editorRevisions.getObjectId.mockImplementation(() => {
    throw new Error("bad hex string")
  })
  const ack2 = jest.fn()
  await onUndo(ctx, { translationId: "tr-1", revisionId: "not-an-id" }, ack2)
  expect(ack2).toHaveBeenCalledWith({ ok: false, reason: "invalid_payload" })
})

test("unknown revision, or one that belongs to another translation", async () => {
  const ctx = makeCtx()

  model.editorRevisions.findById.mockResolvedValue(null)
  const ack1 = jest.fn()
  await onUndo(ctx, { translationId: "tr-1", revisionId: "rev-1" }, ack1)
  expect(ack1).toHaveBeenCalledWith({ ok: false, reason: "unknown_revision" })

  model.editorRevisions.findById.mockResolvedValue({
    translationId: "tr-OTHER",
    type: "rename_speaker",
  })
  const ack2 = jest.fn()
  await onUndo(ctx, { translationId: "tr-1", revisionId: "rev-1" }, ack2)
  expect(ack2).toHaveBeenCalledWith({ ok: false, reason: "unknown_revision" })
})

test("a revision type this handler doesn't know how to undo yet", async () => {
  model.editorRevisions.findById.mockResolvedValue({
    translationId: "tr-1",
    type: "split_turn",
  })
  const ctx = makeCtx()
  const ack = jest.fn()

  await onUndo(ctx, { translationId: "tr-1", revisionId: "rev-1" }, ack)
  expect(ack).toHaveBeenCalledWith({ ok: false, reason: "not_undoable" })
  expect(model.conversationEditor.swapConversationUndoHead).not.toHaveBeenCalled()
})

test("not the last revision: the cursor swap fails, nothing is applied", async () => {
  model.editorRevisions.findById.mockResolvedValue({
    translationId: "tr-1",
    type: "rename_speaker",
    before: { speakerId: "spk-1", name: "Marie" },
    previousHead: "rev-0",
  })
  model.conversationEditor.swapConversationUndoHead.mockResolvedValue(false)
  const ctx = makeCtx()
  const ack = jest.fn()

  await onUndo(ctx, { translationId: "tr-1", revisionId: "rev-1" }, ack)

  expect(ack).toHaveBeenCalledWith({ ok: false, reason: "not_last_revision" })
  expect(model.conversationEditor.renameEditorSpeaker).not.toHaveBeenCalled()
})

test("undoes a rename_speaker: cursor swap passes, restores the old name, does NOT append a revision", async () => {
  model.editorRevisions.findById.mockResolvedValue({
    translationId: "tr-1",
    type: "rename_speaker",
    before: { speakerId: "spk-1", name: "Marie" },
    previousHead: "rev-0",
  })
  model.conversationEditor.swapConversationUndoHead.mockResolvedValue(true)
  model.conversationEditor.renameEditorSpeaker.mockResolvedValue({ version: 8 })
  const ctx = makeCtx()
  const ack = jest.fn()

  await onUndo(ctx, { translationId: "tr-1", revisionId: "rev-1" }, ack)

  expect(model.conversationEditor.swapConversationUndoHead).toHaveBeenCalledWith(
    "tr-1",
    "oid:rev-1",
    "rev-0",
  )
  expect(model.conversationEditor.renameEditorSpeaker).toHaveBeenCalledWith(
    "tr-1",
    "spk-1",
    "Marie",
  )
  // The reply/broadcast carry the cursor's NEW position (previousHead) — what
  // the client would send to undo further, or as-is to redo back forward.
  expect(ctx.emit).toHaveBeenCalledWith("editor:speaker_renamed", {
    translationId: "tr-1",
    speakerId: "spk-1",
    name: "Marie",
    version: 8,
    revisionId: "rev-0",
  })
  expect(ack).toHaveBeenCalledWith({ ok: true, version: 8, revisionId: "rev-0" })
})

test("undoes an update_turn_speaker: restores the previous assignment and hints removedSpeakerId for the one being left", async () => {
  model.editorRevisions.findById.mockResolvedValue({
    translationId: "tr-1",
    type: "update_turn_speaker",
    before: { turnId: "turn-2", speakerId: "spk-2", speakerName: "Thomas" },
    after: { turnId: "turn-2", speakerId: "spk-1", speakerName: "Marie" },
    previousHead: "rev-0",
  })
  model.conversationEditor.swapConversationUndoHead.mockResolvedValue(true)
  model.conversationEditor.updateEditorTurnSpeaker.mockResolvedValue({ version: 10 })
  const ctx = makeCtx()
  const ack = jest.fn()

  await onUndo(ctx, { translationId: "tr-1", revisionId: "rev-3" }, ack)

  expect(model.conversationEditor.updateEditorTurnSpeaker).toHaveBeenCalledWith(
    "tr-1",
    "turn-2",
    { speaker_id: "spk-2", speaker_name: "Thomas" },
  )
  // Leaving spk-1 (the "after" side) behind: hinted so clients can drop it
  // from their local list if it's now unused (they re-check themselves).
  expect(ctx.emit).toHaveBeenCalledWith("editor:turn_speaker_updated", {
    translationId: "tr-1",
    turnId: "turn-2",
    speaker: { id: "spk-2", name: "Thomas" },
    removedSpeakerId: "spk-1",
    version: 10,
    revisionId: "rev-0",
  })
})

test("undoes a replace_speaker: resurrects fromSpeaker and broadcasts editor:speaker_restored", async () => {
  model.editorRevisions.findById.mockResolvedValue({
    translationId: "tr-1",
    type: "replace_speaker",
    before: {
      fromSpeaker: { speaker_id: "spk-1", speaker_name: "Marie" },
      toSpeakerId: "spk-2",
      turnIds: ["turn-1", "turn-3"],
    },
    previousHead: null,
  })
  model.conversationEditor.swapConversationUndoHead.mockResolvedValue(true)
  model.conversationEditor.restoreReplacedSpeaker.mockResolvedValue({ version: 9 })
  const ctx = makeCtx()
  const ack = jest.fn()

  await onUndo(ctx, { translationId: "tr-1", revisionId: "rev-2" }, ack)

  expect(model.conversationEditor.restoreReplacedSpeaker).toHaveBeenCalledWith(
    "tr-1",
    { speaker_id: "spk-1", speaker_name: "Marie" },
    "spk-2",
    ["turn-1", "turn-3"],
  )
  expect(ctx.emit).toHaveBeenCalledWith("editor:speaker_restored", {
    translationId: "tr-1",
    fromSpeaker: { speaker_id: "spk-1", speaker_name: "Marie" },
    toSpeakerId: "spk-2",
    turnIds: ["turn-1", "turn-3"],
    version: 9,
    revisionId: null,
  })
  expect(ack).toHaveBeenCalledWith({ ok: true, version: 9, revisionId: null })
})

test("cursor swap succeeds but the restore itself fails: reports error", async () => {
  model.editorRevisions.findById.mockResolvedValue({
    translationId: "tr-1",
    type: "rename_speaker",
    before: { speakerId: "spk-1", name: "Marie" },
    previousHead: "rev-0",
  })
  model.conversationEditor.swapConversationUndoHead.mockResolvedValue(true)
  model.conversationEditor.renameEditorSpeaker.mockResolvedValue(null)
  const ctx = makeCtx()
  const ack = jest.fn()

  await onUndo(ctx, { translationId: "tr-1", revisionId: "rev-1" }, ack)

  expect(ack).toHaveBeenCalledWith({ ok: false, reason: "error" })
})
