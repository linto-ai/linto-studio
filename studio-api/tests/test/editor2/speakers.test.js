jest.mock(
  `${process.cwd()}/components/WebServer/middlewares/access/conversation`,
  () => ({ hasAccess: jest.fn() }),
)
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  conversations: {
    getById: jest.fn(),
  },
  conversationEditor: {
    updateEditorTurnSpeaker: jest.fn(),
    renameEditorSpeaker: jest.fn(),
    replaceEditorSpeaker: jest.fn(),
    swapConversationUndoHead: jest.fn(),
  },
  editorRevisions: {
    createObjectId: jest.fn(() => "rev-id"),
    insert: jest.fn(),
  },
}))
// Silence winston: a mocked insert failure is expected noise here.
jest.mock(`${process.cwd()}/lib/logger/logger`, () => ({ error: jest.fn() }))

const access = require(
  `${process.cwd()}/components/WebServer/middlewares/access/conversation`,
)
const model = require(`${process.cwd()}/lib/mongodb/models`)
const CONVERSATION_RIGHTS = require(
  `${process.cwd()}/lib/dao/conversation/rights`,
)

const { requireWrite } = require(
  `${process.cwd()}/components/EditorHandler/decorators/requireWrite`,
)
const { onUpdateTurnSpeaker } = require(
  `${process.cwd()}/components/EditorHandler/handlers/onUpdateTurnSpeaker`,
)
const { onRenameSpeaker } = require(
  `${process.cwd()}/components/EditorHandler/handlers/onRenameSpeaker`,
)
const { onReplaceSpeaker } = require(
  `${process.cwd()}/components/EditorHandler/handlers/onReplaceSpeaker`,
)

const CONV = {
  text: [
    { turn_id: "turn-1", speaker_id: "spk-1", segment: "a", words: [] },
    { turn_id: "turn-2", speaker_id: "spk-2", segment: "b", words: [] },
    { turn_id: "turn-3", speaker_id: "spk-1", segment: "c", words: [] },
  ],
  speakers: [
    { speaker_id: "spk-1", speaker_name: "Marie" },
    { speaker_id: "spk-2", speaker_name: "Thomas" },
  ],
}

function makeCtx({ joined = true } = {}) {
  const emit = jest.fn()
  return {
    emit,
    io: { to: jest.fn(() => ({ emit })) },
    socket: {
      id: "sock-1",
      data: joined
        ? {
            editorUser: { userId: "user-1", userName: "Marie Dupont" },
            editorParentId: "conv-1",
          }
        : {},
    },
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  access.hasAccess.mockResolvedValue(true)
  // Happy-path default: the head swap succeeds, so revisionId flows through
  // as "rev-id" unless a test explicitly wants to exercise the race/failure.
  model.conversationEditor.swapConversationUndoHead.mockResolvedValue(true)
})

describe("requireWrite", () => {
  test("checks WRITE on the payload's translation before running the handler", async () => {
    const handler = jest.fn()
    await requireWrite(handler)(
      makeCtx(),
      { translationId: "tr-1", x: 1 },
      jest.fn(),
    )
    expect(access.hasAccess).toHaveBeenCalledWith(
      "tr-1",
      "user-1",
      CONVERSATION_RIGHTS.WRITE,
    )
    expect(handler).toHaveBeenCalled()
  })

  test("refuses without join, without translationId, without WRITE", async () => {
    const handler = jest.fn()
    const ack1 = jest.fn()
    await requireWrite(handler)(
      makeCtx({ joined: false }),
      { translationId: "tr-1" },
      ack1,
    )
    expect(ack1).toHaveBeenCalledWith({ ok: false, reason: "unauthorized" })

    const ack2 = jest.fn()
    await requireWrite(handler)(makeCtx(), {}, ack2)
    expect(ack2).toHaveBeenCalledWith({ ok: false, reason: "invalid_payload" })

    access.hasAccess.mockResolvedValue(false)
    const ack3 = jest.fn()
    await requireWrite(handler)(makeCtx(), { translationId: "tr-1" }, ack3)
    expect(ack3).toHaveBeenCalledWith({ ok: false, reason: "forbidden" })

    expect(handler).not.toHaveBeenCalled()
  })
})

describe("onUpdateTurnSpeaker", () => {
  const BASE = { translationId: "tr-1", turnId: "turn-2" }

  test("assigns an existing speaker and predicts the GC of the orphaned one", async () => {
    model.conversations.getById.mockResolvedValue([CONV])
    model.conversationEditor.updateEditorTurnSpeaker.mockResolvedValue({
      version: 3,
      previousSpeaker: { speaker_id: "spk-2", speaker_name: "Thomas" },
      undoHead: null,
    })
    const ctx = makeCtx()
    const ack = jest.fn()

    // turn-2 was spk-2's ONLY turn: assigning spk-1 orphans spk-2.
    await onUpdateTurnSpeaker(ctx, { ...BASE, speakerId: "spk-1" }, ack)

    expect(
      model.conversationEditor.updateEditorTurnSpeaker,
    ).toHaveBeenCalledWith("tr-1", "turn-2", {
      speaker_id: "spk-1",
      speaker_name: "Marie",
    })
    const [event, broadcast] = ctx.emit.mock.calls[0]
    expect(event).toBe("editor:turn_speaker_updated")
    expect(broadcast).toEqual({
      translationId: "tr-1",
      turnId: "turn-2",
      speaker: { id: "spk-1", name: "Marie" },
      removedSpeakerId: "spk-2",
      version: 3,
      revisionId: "rev-id",
      redoRevisionId: null,
    })
    expect(ack).toHaveBeenCalledWith({
      ok: true,
      version: 3,
      revisionId: "rev-id",
      redoRevisionId: null,
    })
    // spk-2 (previous) was turn-2's assignment: recorded so undo can restore it.
    expect(model.editorRevisions.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "update_turn_speaker",
        before: { turnId: "turn-2", speakerId: "spk-2", speakerName: "Thomas" },
        after: { turnId: "turn-2", speakerId: "spk-1", speakerName: "Marie" },
      }),
    )
    expect(
      model.conversationEditor.swapConversationUndoHead,
    ).toHaveBeenCalledWith("tr-1", null, "rev-id")
  })

  test("no GC when the previous speaker still has turns", async () => {
    model.conversations.getById.mockResolvedValue([CONV])
    model.conversationEditor.updateEditorTurnSpeaker.mockResolvedValue({
      version: 4,
    })
    const ctx = makeCtx()

    // turn-1 is spk-1's turn but spk-1 also holds turn-3: no GC.
    await onUpdateTurnSpeaker(
      ctx,
      { translationId: "tr-1", turnId: "turn-1", speakerId: "spk-2" },
      jest.fn(),
    )

    const [, broadcast] = ctx.emit.mock.calls[0]
    expect("removedSpeakerId" in broadcast).toBe(false)
  })

  test("creates-and-assigns from a name (server-minted id)", async () => {
    model.conversations.getById.mockResolvedValue([CONV])
    model.conversationEditor.updateEditorTurnSpeaker.mockResolvedValue({
      version: 5,
    })
    const ctx = makeCtx()
    const ack = jest.fn()

    await onUpdateTurnSpeaker(ctx, { ...BASE, speakerName: " Julie " }, ack)

    const [, , speaker] =
      model.conversationEditor.updateEditorTurnSpeaker.mock.calls[0]
    expect(speaker.speaker_name).toBe("Julie")
    expect(speaker.speaker_id).toBeDefined()
    expect(speaker.speaker_id).not.toBe("spk-1")
    const [, broadcast] = ctx.emit.mock.calls[0]
    expect(broadcast.speaker.name).toBe("Julie")
  })

  test("already assigned: acks ok without writing nor broadcasting", async () => {
    model.conversations.getById.mockResolvedValue([CONV])
    const ctx = makeCtx()
    const ack = jest.fn()

    await onUpdateTurnSpeaker(ctx, { ...BASE, speakerId: "spk-2" }, ack)

    expect(
      model.conversationEditor.updateEditorTurnSpeaker,
    ).not.toHaveBeenCalled()
    expect(ctx.emit).not.toHaveBeenCalled()
    expect(ack).toHaveBeenCalledWith({ ok: true })
  })

  test("refuses an unknown speaker and malformed payloads", async () => {
    model.conversations.getById.mockResolvedValue([CONV])
    const ctx = makeCtx()

    const ack1 = jest.fn()
    await onUpdateTurnSpeaker(ctx, { ...BASE, speakerId: "spk-404" }, ack1)
    expect(ack1).toHaveBeenCalledWith({ ok: false, reason: "unknown_speaker" })

    const ack2 = jest.fn()
    await onUpdateTurnSpeaker(ctx, BASE, ack2)
    expect(ack2).toHaveBeenCalledWith({ ok: false, reason: "invalid_payload" })

    const ack3 = jest.fn()
    await onUpdateTurnSpeaker(
      ctx,
      { ...BASE, speakerId: "spk-1", speakerName: "X" },
      ack3,
    )
    expect(ack3).toHaveBeenCalledWith({ ok: false, reason: "invalid_payload" })
  })
})

describe("onRenameSpeaker", () => {
  test("renames (trimmed), records a revision and broadcasts", async () => {
    model.conversationEditor.renameEditorSpeaker.mockResolvedValue({
      version: 6,
      previousName: "Marie",
      undoHead: null,
    })
    const ctx = makeCtx()
    const ack = jest.fn()

    await onRenameSpeaker(
      ctx,
      { translationId: "tr-1", speakerId: "spk-1", name: "  Marie D.  " },
      ack,
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
      version: 6,
      revisionId: "rev-id",
      redoRevisionId: null,
    })
    expect(ack).toHaveBeenCalledWith({
      ok: true,
      version: 6,
      revisionId: "rev-id",
      redoRevisionId: null,
    })
    expect(model.editorRevisions.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "rename_speaker",
        before: { speakerId: "spk-1", name: "Marie" },
        after: { speakerId: "spk-1", name: "Marie D." },
        previousHead: null,
      }),
    )
    expect(
      model.conversationEditor.swapConversationUndoHead,
    ).toHaveBeenCalledWith("tr-1", null, "rev-id")
  })

  test("refuses an empty name and an unknown speaker", async () => {
    const ctx = makeCtx()
    const ack1 = jest.fn()
    await onRenameSpeaker(
      ctx,
      { translationId: "tr-1", speakerId: "spk-1", name: "  " },
      ack1,
    )
    expect(ack1).toHaveBeenCalledWith({ ok: false, reason: "invalid_payload" })

    model.conversationEditor.renameEditorSpeaker.mockResolvedValue(null)
    const ack2 = jest.fn()
    await onRenameSpeaker(
      ctx,
      { translationId: "tr-1", speakerId: "spk-404", name: "X" },
      ack2,
    )
    expect(ack2).toHaveBeenCalledWith({ ok: false, reason: "unknown_speaker" })
  })
})

describe("onReplaceSpeaker", () => {
  test("replaces and broadcasts, using the affected turns/fromSpeaker captured atomically by the mutation itself", async () => {
    model.conversationEditor.replaceEditorSpeaker.mockResolvedValue({
      version: 7,
      fromSpeaker: { speaker_id: "spk-1", speaker_name: "Marie" },
      turnIds: ["turn-1", "turn-3"],
      undoHead: null,
    })
    const ctx = makeCtx()
    const ack = jest.fn()

    await onReplaceSpeaker(
      ctx,
      { translationId: "tr-1", fromSpeakerId: "spk-1", toSpeakerId: "spk-2" },
      ack,
    )

    expect(model.conversationEditor.replaceEditorSpeaker).toHaveBeenCalledWith(
      "tr-1",
      "spk-1",
      "spk-2",
    )
    expect(ctx.emit).toHaveBeenCalledWith("editor:speaker_replaced", {
      translationId: "tr-1",
      fromSpeakerId: "spk-1",
      toSpeakerId: "spk-2",
      version: 7,
      revisionId: "rev-id",
      redoRevisionId: null,
    })
    expect(ack).toHaveBeenCalledWith({
      ok: true,
      version: 7,
      revisionId: "rev-id",
      redoRevisionId: null,
    })
    expect(model.editorRevisions.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "replace_speaker",
        before: {
          fromSpeaker: { speaker_id: "spk-1", speaker_name: "Marie" },
          toSpeakerId: "spk-2",
          turnIds: ["turn-1", "turn-3"],
        },
      }),
    )
  })

  test("refuses self-replacement and unknown speakers", async () => {
    const ctx = makeCtx()
    const ack1 = jest.fn()
    await onReplaceSpeaker(
      ctx,
      { translationId: "tr-1", fromSpeakerId: "spk-1", toSpeakerId: "spk-1" },
      ack1,
    )
    expect(ack1).toHaveBeenCalledWith({ ok: false, reason: "invalid_payload" })

    // The mutation's own filter requires both speakers to exist; a missing
    // one just means no document matched, same as before.
    model.conversationEditor.replaceEditorSpeaker.mockResolvedValue(null)
    const ack2 = jest.fn()
    await onReplaceSpeaker(
      ctx,
      { translationId: "tr-1", fromSpeakerId: "spk-404", toSpeakerId: "spk-2" },
      ack2,
    )
    expect(ack2).toHaveBeenCalledWith({ ok: false, reason: "unknown_speaker" })
  })
})

describe("recordSpeakerRevision resilience", () => {
  test("a lost head-swap race doesn't block the mutation: it still broadcasts, just with revisionId: null", async () => {
    model.conversationEditor.renameEditorSpeaker.mockResolvedValue({
      version: 6,
      previousName: "Marie",
      undoHead: null,
    })
    model.conversationEditor.swapConversationUndoHead.mockResolvedValue(false)
    const ctx = makeCtx()
    const ack = jest.fn()

    await onRenameSpeaker(
      ctx,
      { translationId: "tr-1", speakerId: "spk-1", name: "Marie D." },
      ack,
    )

    expect(ctx.emit).toHaveBeenCalledWith("editor:speaker_renamed", {
      translationId: "tr-1",
      speakerId: "spk-1",
      name: "Marie D.",
      version: 6,
      revisionId: null,
      redoRevisionId: null,
    })
    expect(ack).toHaveBeenCalledWith({
      ok: true,
      version: 6,
      revisionId: null,
      redoRevisionId: null,
    })
  })

  test("a failure writing the revision itself doesn't block the mutation either", async () => {
    model.conversationEditor.renameEditorSpeaker.mockResolvedValue({
      version: 6,
      previousName: "Marie",
      undoHead: null,
    })
    model.editorRevisions.insert.mockRejectedValue(new Error("mongo blip"))
    const ctx = makeCtx()
    const ack = jest.fn()

    await onRenameSpeaker(
      ctx,
      { translationId: "tr-1", speakerId: "spk-1", name: "Marie D." },
      ack,
    )

    expect(ack).toHaveBeenCalledWith({
      ok: true,
      version: 6,
      revisionId: null,
      redoRevisionId: null,
    })
    expect(
      model.conversationEditor.swapConversationUndoHead,
    ).not.toHaveBeenCalled()
  })
})
