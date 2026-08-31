jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  conversationEditor: {
    renameEditorSpeaker: jest.fn(),
    updateEditorTurnSpeaker: jest.fn(),
    replaceEditorSpeaker: jest.fn(),
    swapConversationUndoHead: jest.fn(),
  },
  editorRevisions: {
    findByPreviousHead: jest.fn(),
    getObjectId: jest.fn((id) => `oid:${id}`),
  },
}))

const model = require(`${process.cwd()}/lib/mongodb/models`)
const { onRedo } = require(`${process.cwd()}/components/EditorHandler/handlers/onRedo`)

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

test("rejects a malformed revisionId (but null is a legitimate 'start of history' cursor)", async () => {
  const ctx = makeCtx()
  model.editorRevisions.getObjectId.mockImplementation(() => {
    throw new Error("bad hex string")
  })
  const ack = jest.fn()
  await onRedo(ctx, { translationId: "tr-1", revisionId: "not-an-id" }, ack)
  expect(ack).toHaveBeenCalledWith({ ok: false, reason: "invalid_payload" })

  // Missing key entirely defaults to null, same as an explicit null.
  model.editorRevisions.findByPreviousHead.mockResolvedValue(null)
  const ack2 = jest.fn()
  await onRedo(ctx, { translationId: "tr-1" }, ack2)
  expect(model.editorRevisions.findByPreviousHead).toHaveBeenCalledWith("tr-1", null)
  expect(ack2).toHaveBeenCalledWith({ ok: false, reason: "nothing_to_redo" })
})

test("nothing to redo: the cursor is already at the tip of history", async () => {
  model.editorRevisions.findByPreviousHead.mockResolvedValue(null)
  const ctx = makeCtx()
  const ack = jest.fn()

  await onRedo(ctx, { translationId: "tr-1", revisionId: "rev-0" }, ack)

  expect(ack).toHaveBeenCalledWith({ ok: false, reason: "nothing_to_redo" })
  expect(model.conversationEditor.swapConversationUndoHead).not.toHaveBeenCalled()
})

test("not the last cursor position anymore: the swap fails, nothing is applied", async () => {
  model.editorRevisions.findByPreviousHead.mockResolvedValue({
    _id: "rev-1",
    type: "rename_speaker",
    after: { speakerId: "spk-1", name: "Marie D." },
  })
  model.conversationEditor.swapConversationUndoHead.mockResolvedValue(false)
  const ctx = makeCtx()
  const ack = jest.fn()

  await onRedo(ctx, { translationId: "tr-1", revisionId: "rev-0" }, ack)

  expect(ack).toHaveBeenCalledWith({ ok: false, reason: "not_last_revision" })
  expect(model.conversationEditor.renameEditorSpeaker).not.toHaveBeenCalled()
})

test("redoes a rename_speaker: cursor swap passes, re-applies the new name", async () => {
  model.editorRevisions.findByPreviousHead.mockResolvedValue({
    _id: "rev-1",
    type: "rename_speaker",
    after: { speakerId: "spk-1", name: "Marie D." },
  })
  model.conversationEditor.swapConversationUndoHead.mockResolvedValue(true)
  model.conversationEditor.renameEditorSpeaker.mockResolvedValue({ version: 9 })
  const ctx = makeCtx()
  const ack = jest.fn()

  await onRedo(ctx, { translationId: "tr-1", revisionId: "rev-0" }, ack)

  expect(model.editorRevisions.findByPreviousHead).toHaveBeenCalledWith(
    "tr-1",
    "oid:rev-0",
  )
  expect(model.conversationEditor.swapConversationUndoHead).toHaveBeenCalledWith(
    "tr-1",
    "oid:rev-0",
    "rev-1",
  )
  expect(model.conversationEditor.renameEditorSpeaker).toHaveBeenCalledWith(
    "tr-1",
    "spk-1",
    "Marie D.",
  )
  expect(ctx.emit).toHaveBeenCalledWith("editor:speaker_renamed", {
    translationId: "tr-1",
    speakerId: "spk-1",
    name: "Marie D.",
    version: 9,
    revisionId: "rev-1",
  })
  expect(ack).toHaveBeenCalledWith({ ok: true, version: 9, revisionId: "rev-1" })
})

test("redoes an update_turn_speaker: re-applies the new assignment and hints removedSpeakerId for the one being left", async () => {
  model.editorRevisions.findByPreviousHead.mockResolvedValue({
    _id: "rev-4",
    type: "update_turn_speaker",
    before: { turnId: "turn-2", speakerId: "spk-2", speakerName: "Thomas" },
    after: { turnId: "turn-2", speakerId: "spk-1", speakerName: "Marie" },
  })
  model.conversationEditor.swapConversationUndoHead.mockResolvedValue(true)
  model.conversationEditor.updateEditorTurnSpeaker.mockResolvedValue({ version: 11 })
  const ctx = makeCtx()
  const ack = jest.fn()

  await onRedo(ctx, { translationId: "tr-1", revisionId: "rev-0" }, ack)

  expect(model.conversationEditor.updateEditorTurnSpeaker).toHaveBeenCalledWith(
    "tr-1",
    "turn-2",
    { speaker_id: "spk-1", speaker_name: "Marie" },
  )
  // Leaving spk-2 (the "before" side) behind this time — opposite direction.
  expect(ctx.emit).toHaveBeenCalledWith("editor:turn_speaker_updated", {
    translationId: "tr-1",
    turnId: "turn-2",
    speaker: { id: "spk-1", name: "Marie" },
    removedSpeakerId: "spk-2",
    version: 11,
    revisionId: "rev-4",
  })
})

test("redoes a replace_speaker: replays the merge forward, broadcasts editor:speaker_replaced", async () => {
  model.editorRevisions.findByPreviousHead.mockResolvedValue({
    _id: "rev-2",
    type: "replace_speaker",
    after: { fromSpeakerId: "spk-1", toSpeakerId: "spk-2" },
  })
  model.conversationEditor.swapConversationUndoHead.mockResolvedValue(true)
  model.conversationEditor.replaceEditorSpeaker.mockResolvedValue({ version: 10 })
  const ctx = makeCtx()
  const ack = jest.fn()

  await onRedo(ctx, { translationId: "tr-1", revisionId: null }, ack)

  expect(model.conversationEditor.replaceEditorSpeaker).toHaveBeenCalledWith(
    "tr-1",
    "spk-1",
    "spk-2",
  )
  expect(ctx.emit).toHaveBeenCalledWith("editor:speaker_replaced", {
    translationId: "tr-1",
    fromSpeakerId: "spk-1",
    toSpeakerId: "spk-2",
    version: 10,
    revisionId: "rev-2",
  })
})
