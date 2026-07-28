// onUpdateTurn → computeRetimedTurn → getSyllabic loads the ESM-only
// `syllable` package Jest can't transform (fr path is self-contained).
jest.mock("syllable", () => ({ syllable: () => 1 }))

jest.mock(
  `${process.cwd()}/components/WebServer/config/passport/middleware`,
  () => ({ checkSocket: jest.fn() }),
)
jest.mock(
  `${process.cwd()}/components/WebServer/middlewares/access/conversation`,
  () => ({ hasAccess: jest.fn() }),
)
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  users: { getById: jest.fn() },
  editorLocks: {
    listByParent: jest.fn(),
    releaseAllForSocket: jest.fn(),
    findLiveLocks: jest.fn(),
  },
  conversations: {
    getById: jest.fn(),
    updateEditorTurn: jest.fn(),
    splitEditorTurn: jest.fn(),
    mergeEditorTurns: jest.fn(),
    deleteEditorTurn: jest.fn(),
    getFamilyEditorVersions: jest.fn(),
  },
}))

const auth = require(
  `${process.cwd()}/components/WebServer/config/passport/middleware`,
)
const access = require(
  `${process.cwd()}/components/WebServer/middlewares/access/conversation`,
)
const model = require(`${process.cwd()}/lib/mongodb/models`)
const CONVERSATION_RIGHTS = require(
  `${process.cwd()}/lib/dao/conversation/rights`,
)

const { onJoin } = require(
  `${process.cwd()}/components/EditorHandler/handlers/onJoin`,
)
const { onLeave } = require(
  `${process.cwd()}/components/EditorHandler/handlers/onLeave`,
)
const { onUpdateTurn } = require(
  `${process.cwd()}/components/EditorHandler/handlers/onUpdateTurn`,
)
const { onSplitTurn } = require(
  `${process.cwd()}/components/EditorHandler/handlers/onSplitTurn`,
)
const { onDeleteTurn } = require(
  `${process.cwd()}/components/EditorHandler/handlers/onDeleteTurn`,
)
const { requireWrite } = require(
  `${process.cwd()}/components/EditorHandler/decorators/requireWrite`,
)
const { onMergeTurns: rawOnMergeTurns } = require(
  `${process.cwd()}/components/EditorHandler/handlers/onMergeTurns`,
)
// Production wiring: merge carries no lock, WRITE comes from requireWrite.
const onMergeTurns = requireWrite(rawOnMergeTurns)

function makeCtx() {
  const emit = jest.fn()
  return {
    emit,
    io: { to: jest.fn(() => ({ emit })) },
    socket: {
      id: "sock-1",
      // Mutation handlers derive the broadcast room from the joined parent.
      data: { editorParentId: "conv-1" },
      join: jest.fn(),
      leave: jest.fn(),
    },
  }
}

function authorizeUser() {
  auth.checkSocket.mockResolvedValue({ isAuth: true, userId: "user-1" })
  access.hasAccess.mockResolvedValue(true)
  model.users.getById.mockResolvedValue([
    { firstname: "Marie", lastname: "Dupont" },
  ])
  model.editorLocks.listByParent.mockResolvedValue([])
  model.conversations.getFamilyEditorVersions.mockResolvedValue({})
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe("onJoin", () => {
  test("joins the room, caches the identity, acks the live locks", async () => {
    authorizeUser()
    model.editorLocks.listByParent.mockResolvedValue([
      {
        parentId: "conv-1",
        translationId: "tr-1",
        turnId: "turn-9",
        userId: "user-2",
        socketId: "sock-9",
        userName: "Thomas",
        expiresAt: new Date(),
      },
    ])
    model.conversations.getFamilyEditorVersions.mockResolvedValue({
      "conv-1": 3,
      "tr-1": 7,
    })
    const ctx = makeCtx()
    const ack = jest.fn()

    await onJoin(ctx, "conv-1", ack)

    expect(access.hasAccess).toHaveBeenCalledWith(
      "conv-1",
      "user-1",
      CONVERSATION_RIGHTS.READ,
    )
    expect(ctx.socket.join).toHaveBeenCalledWith("editor/conv-1")
    expect(ctx.socket.data.editorUser).toEqual({
      userId: "user-1",
      userName: "Marie Dupont",
    })
    expect(ctx.socket.data.editorParentId).toBe("conv-1")
    expect(ctx.socket.data.editorFamily).toEqual(new Set(["conv-1", "tr-1"]))
    expect(ack).toHaveBeenCalledWith({
      ok: true,
      locks: [
        {
          translationId: "tr-1",
          turnId: "turn-9",
          userId: "user-2",
          userName: "Thomas",
        },
      ],
      users: [],
      versions: { "conv-1": 3, "tr-1": 7 },
    })
  })

  test("rejects an unauthenticated socket", async () => {
    auth.checkSocket.mockResolvedValue(false)
    const ctx = makeCtx()
    const ack = jest.fn()

    await onJoin(ctx, "conv-1", ack)

    expect(ctx.socket.join).not.toHaveBeenCalled()
    expect(ctx.socket.data.editorUser).toBeUndefined()
    expect(ack).toHaveBeenCalledWith({ ok: false, reason: "unauthorized" })
  })

  test("rejects a public session token (no userId)", async () => {
    auth.checkSocket.mockResolvedValue({ isAuth: true, sessionId: "sess-1" })
    const ctx = makeCtx()
    const ack = jest.fn()

    await onJoin(ctx, "conv-1", ack)

    expect(access.hasAccess).not.toHaveBeenCalled()
    expect(ack).toHaveBeenCalledWith({ ok: false, reason: "unauthorized" })
  })

  test("rejects a user without READ access", async () => {
    auth.checkSocket.mockResolvedValue({ isAuth: true, userId: "user-1" })
    access.hasAccess.mockResolvedValue(false)
    const ctx = makeCtx()
    const ack = jest.fn()

    await onJoin(ctx, "conv-1", ack)

    expect(ctx.socket.join).not.toHaveBeenCalled()
    expect(ack).toHaveBeenCalledWith({ ok: false, reason: "forbidden" })
  })

  test("acks an error instead of throwing when a check fails", async () => {
    auth.checkSocket.mockResolvedValue({ isAuth: true, userId: "user-1" })
    access.hasAccess.mockRejectedValue(new Error("mongo down"))
    const ctx = makeCtx()
    const ack = jest.fn()

    await onJoin(ctx, "conv-1", ack)

    expect(ack).toHaveBeenCalledWith({ ok: false, reason: "error" })
  })

  test("tolerates a missing ack", async () => {
    authorizeUser()
    await expect(onJoin(makeCtx(), "conv-1", undefined)).resolves.toBeUndefined()
  })
})

describe("onLeave", () => {
  test("releases the locks held on THIS conversation, then leaves the room", async () => {
    model.editorLocks.releaseAllForSocket.mockResolvedValue([
      { parentId: "conv-1", translationId: "tr-1", turnId: "turn-1" },
    ])
    const ctx = makeCtx()
    ctx.socket.data.editorUser = { userId: "user-1", userName: "Marie" }
    ctx.socket.data.editorFamily = new Set(["conv-1", "tr-1"])

    await onLeave(ctx, "conv-1")

    expect(model.editorLocks.releaseAllForSocket).toHaveBeenCalledWith(
      "sock-1",
      { parentId: "conv-1" },
    )
    expect(ctx.io.to).toHaveBeenCalledWith("editor/conv-1")
    expect(ctx.emit).toHaveBeenCalledWith("editor:turn_unlocked", {
      translationId: "tr-1",
      turnId: "turn-1",
    })
    expect(ctx.socket.leave).toHaveBeenCalledWith("editor/conv-1")
    // Identity is connection-scoped: leaving a view must NOT clear it
    // (another editor view on the same socket may still rely on it).
    expect(ctx.socket.data.editorUser).toEqual({
      userId: "user-1",
      userName: "Marie",
    })
    // The parent/family ARE view-scoped: cleared on leave.
    expect(ctx.socket.data.editorParentId).toBeUndefined()
    expect(ctx.socket.data.editorFamily).toBeUndefined()
  })

  test("still leaves the room when the lock cleanup fails", async () => {
    model.editorLocks.releaseAllForSocket.mockRejectedValue(
      new Error("mongo down"),
    )
    const ctx = makeCtx()

    await onLeave(ctx, "conv-1")

    expect(ctx.socket.leave).toHaveBeenCalledWith("editor/conv-1")
  })
})

describe("onUpdateTurn", () => {
  const PAYLOAD = {
    translationId: "tr-1",
    turnId: "turn-1",
    text: "Bonjour  tous le monde ",
  }
  const OLD_TURN = {
    turn_id: "turn-1",
    language: "fr",
    stime: 0,
    etime: 2,
    words: [
      { wid: "w-1", word: "Bonjour", stime: 0, etime: 0.8 },
      { wid: "w-2", word: "tout", stime: 0.9, etime: 1.1 },
      { wid: "w-3", word: "le", stime: 1.2, etime: 1.3 },
      { wid: "w-4", word: "monde", stime: 1.4, etime: 1.8 },
    ],
  }

  test("retimes, persists (version bumped) and broadcasts the wire turn", async () => {
    model.conversations.getById.mockResolvedValue([{ text: [OLD_TURN] }])
    model.conversations.updateEditorTurn.mockResolvedValue({ version: 7 })
    const ctx = makeCtx()
    const ack = jest.fn()

    await onUpdateTurn(ctx, PAYLOAD, ack)

    // Normalized text (whitespace contract) reaches the persist layer.
    const [convId, turnId, retimed] =
      model.conversations.updateEditorTurn.mock.calls[0]
    expect(convId).toBe("tr-1")
    expect(turnId).toBe("turn-1")
    expect(retimed.segment).toBe("Bonjour tous le monde")
    expect(retimed.words).toHaveLength(4)

    expect(ctx.io.to).toHaveBeenCalledWith("editor/conv-1")
    const [event, broadcast] = ctx.emit.mock.calls[0]
    expect(event).toBe("editor:turn_updated")
    expect(broadcast.translationId).toBe("tr-1")
    expect(broadcast.turnId).toBe("turn-1")
    expect(broadcast.text).toBe("Bonjour tous le monde")
    expect(broadcast.version).toBe(7)
    // No wid on the wire: clients consume words positionally.
    expect(broadcast.words.every((w) => !("wid" in w))).toBe(true)
    expect(broadcast.words[0]).toMatchObject({ word: "Bonjour", stime: 0 })

    expect(ack).toHaveBeenCalledWith({ ok: true, version: 7 })
  })

  test("acks a conflict when the turn no longer exists", async () => {
    model.conversations.getById.mockResolvedValue([{ text: [] }])
    const ctx = makeCtx()
    const ack = jest.fn()

    await onUpdateTurn(ctx, PAYLOAD, ack)

    expect(model.conversations.updateEditorTurn).not.toHaveBeenCalled()
    expect(ctx.emit).not.toHaveBeenCalled()
    expect(ack).toHaveBeenCalledWith({ ok: false, reason: "conflict" })
  })

  test("acks a conflict when the write matched nothing (vanished meanwhile)", async () => {
    model.conversations.getById.mockResolvedValue([{ text: [OLD_TURN] }])
    model.conversations.updateEditorTurn.mockResolvedValue(null)
    const ctx = makeCtx()
    const ack = jest.fn()

    await onUpdateTurn(ctx, PAYLOAD, ack)

    expect(ctx.emit).not.toHaveBeenCalled()
    expect(ack).toHaveBeenCalledWith({ ok: false, reason: "conflict" })
  })

  test("rejects a payload without text", async () => {
    const ctx = makeCtx()
    const ack = jest.fn()

    await onUpdateTurn(ctx, { translationId: "tr-1", turnId: "turn-1" }, ack)

    expect(model.conversations.getById).not.toHaveBeenCalled()
    expect(ack).toHaveBeenCalledWith({ ok: false, reason: "invalid_payload" })
  })

  test("acks an error instead of throwing when the DB write fails", async () => {
    model.conversations.getById.mockResolvedValue([{ text: [OLD_TURN] }])
    model.conversations.updateEditorTurn.mockRejectedValue(
      new Error("mongo down"),
    )
    const ctx = makeCtx()
    const ack = jest.fn()

    await onUpdateTurn(ctx, PAYLOAD, ack)

    expect(ack).toHaveBeenCalledWith({ ok: false, reason: "error" })
  })
})

describe("onSplitTurn", () => {
  const PAYLOAD = {
    translationId: "tr-1",
    turnId: "turn-1",
    offset: 12,
  }
  const OLD_TURN = {
    turn_id: "turn-1",
    speaker_id: "spk-1",
    language: "fr",
    segment: "Bonjour tout le monde",
    words: [
      { wid: "w-1", word: "Bonjour", stime: 0, etime: 0.8 },
      { wid: "w-2", word: "tout", stime: 0.9, etime: 1.1 },
      { wid: "w-3", word: "le", stime: 1.2, etime: 1.3 },
      { wid: "w-4", word: "monde", stime: 1.4, etime: 1.8 },
    ],
  }

  test("splits, persists and broadcasts both wire halves", async () => {
    model.conversations.getById.mockResolvedValue([{ text: [OLD_TURN] }])
    model.conversations.splitEditorTurn.mockResolvedValue({ version: 4 })
    const ctx = makeCtx()
    const ack = jest.fn()

    await onSplitTurn(ctx, PAYLOAD, ack)

    const [convId, turnId, left, right] =
      model.conversations.splitEditorTurn.mock.calls[0]
    expect(convId).toBe("tr-1")
    expect(turnId).toBe("turn-1")
    expect(left.segment).toBe("Bonjour tout")
    expect(right.segment).toBe("le monde")

    expect(ctx.io.to).toHaveBeenCalledWith("editor/conv-1")
    const [event, broadcast] = ctx.emit.mock.calls[0]
    expect(event).toBe("editor:turn_split")
    expect(broadcast.originalTurnId).toBe("turn-1")
    expect(broadcast.turns).toHaveLength(2)
    expect(broadcast.turns[0]).toMatchObject({
      turnId: "turn-1",
      text: "Bonjour tout",
      speakerId: "spk-1",
      language: "fr",
    })
    expect(broadcast.turns[1].turnId).not.toBe("turn-1")
    expect(broadcast.turns[1].words.every((w) => !("wid" in w))).toBe(true)
    expect(broadcast.version).toBe(4)
    expect(ack).toHaveBeenCalledWith({ ok: true, version: 4 })
  })

  test("refuses a border offset (empty half)", async () => {
    model.conversations.getById.mockResolvedValue([{ text: [OLD_TURN] }])
    const ctx = makeCtx()
    const ack = jest.fn()

    await onSplitTurn(ctx, { ...PAYLOAD, offset: 0 }, ack)

    expect(model.conversations.splitEditorTurn).not.toHaveBeenCalled()
    expect(ack).toHaveBeenCalledWith({ ok: false, reason: "invalid_offset" })
  })

  test("acks a conflict when the turn vanished", async () => {
    model.conversations.getById.mockResolvedValue([{ text: [] }])
    const ctx = makeCtx()
    const ack = jest.fn()

    await onSplitTurn(ctx, PAYLOAD, ack)

    expect(ack).toHaveBeenCalledWith({ ok: false, reason: "conflict" })
  })

  test("rejects a payload without offset", async () => {
    const ctx = makeCtx()
    const ack = jest.fn()

    await onSplitTurn(ctx, { ...PAYLOAD, offset: undefined }, ack)

    expect(model.conversations.getById).not.toHaveBeenCalled()
    expect(ack).toHaveBeenCalledWith({ ok: false, reason: "invalid_payload" })
  })
})

describe("onMergeTurns", () => {
  const PAYLOAD = {
    translationId: "tr-1",
    firstTurnId: "turn-1",
    secondTurnId: "turn-2",
  }
  const FIRST = {
    turn_id: "turn-1",
    speaker_id: "spk-1",
    language: "fr",
    segment: "Bonjour tout le monde",
    words: [
      { wid: "w-1", word: "Bonjour", stime: 0, etime: 0.8 },
      { wid: "w-2", word: "tout", stime: 0.9, etime: 1.1 },
      { wid: "w-3", word: "le", stime: 1.2, etime: 1.3 },
      { wid: "w-4", word: "monde", stime: 1.4, etime: 1.8 },
    ],
  }
  const SECOND = {
    turn_id: "turn-2",
    speaker_id: "spk-2",
    language: "fr",
    segment: "Oui",
    words: [{ wid: "w-5", word: "Oui", stime: 2, etime: 2.4 }],
  }

  function joinedCtx() {
    const ctx = makeCtx()
    ctx.socket.data.editorUser = { userId: "user-1", userName: "Marie" }
    return ctx
  }

  test("merges free adjacent turns, persists and broadcasts", async () => {
    access.hasAccess.mockResolvedValue(true)
    model.editorLocks.findLiveLocks.mockResolvedValue([])
    model.conversations.getById.mockResolvedValue([{ text: [FIRST, SECOND] }])
    model.conversations.mergeEditorTurns.mockResolvedValue({ version: 9 })
    const ctx = joinedCtx()
    const ack = jest.fn()

    await onMergeTurns(ctx, PAYLOAD, ack)

    expect(access.hasAccess).toHaveBeenCalledWith(
      "tr-1",
      "user-1",
      CONVERSATION_RIGHTS.WRITE,
    )
    const [convId, firstId, secondId, merged] =
      model.conversations.mergeEditorTurns.mock.calls[0]
    expect([convId, firstId, secondId]).toEqual(["tr-1", "turn-1", "turn-2"])
    // The larger turn (turn-1) provides the attributes.
    expect(merged.turn_id).toBe("turn-1")
    expect(merged.speaker_id).toBe("spk-1")
    expect(merged.segment).toBe("Bonjour tout le monde Oui")

    const [event, broadcast] = ctx.emit.mock.calls[0]
    expect(event).toBe("editor:turns_merged")
    expect(broadcast.mergedTurnId).toBe("turn-1")
    expect(broadcast.removedTurnId).toBe("turn-2")
    expect(broadcast.turn.words.every((w) => !("wid" in w))).toBe(true)
    expect(broadcast.version).toBe(9)
    expect(ack).toHaveBeenCalledWith({ ok: true, version: 9 })
  })

  test("refuses when either turn is locked — requester included", async () => {
    access.hasAccess.mockResolvedValue(true)
    model.editorLocks.findLiveLocks.mockResolvedValue([
      {
        turnId: "turn-1",
        userId: "user-1",
        userName: "Marie",
        socketId: "sock-1",
      },
    ])
    const ctx = joinedCtx()
    const ack = jest.fn()

    await onMergeTurns(ctx, PAYLOAD, ack)

    expect(model.conversations.mergeEditorTurns).not.toHaveBeenCalled()
    expect(ack).toHaveBeenCalledWith({
      ok: false,
      reason: "locked",
      holder: { userId: "user-1", userName: "Marie" },
    })
  })

  test("refuses non-adjacent turns", async () => {
    access.hasAccess.mockResolvedValue(true)
    model.editorLocks.findLiveLocks.mockResolvedValue([])
    model.conversations.getById.mockResolvedValue([
      { text: [FIRST, { turn_id: "turn-x", segment: "", words: [] }, SECOND] },
    ])
    const ctx = joinedCtx()
    const ack = jest.fn()

    await onMergeTurns(ctx, PAYLOAD, ack)

    expect(model.conversations.mergeEditorTurns).not.toHaveBeenCalled()
    expect(ack).toHaveBeenCalledWith({ ok: false, reason: "not_adjacent" })
  })

  test("refuses without WRITE access", async () => {
    access.hasAccess.mockResolvedValue(false)
    const ctx = joinedCtx()
    const ack = jest.fn()

    await onMergeTurns(ctx, PAYLOAD, ack)

    expect(model.editorLocks.findLiveLocks).not.toHaveBeenCalled()
    expect(ack).toHaveBeenCalledWith({ ok: false, reason: "forbidden" })
  })

  test("requires a prior join", async () => {
    const ctx = makeCtx()
    const ack = jest.fn()

    await onMergeTurns(ctx, PAYLOAD, ack)

    expect(access.hasAccess).not.toHaveBeenCalled()
    expect(ack).toHaveBeenCalledWith({ ok: false, reason: "unauthorized" })
  })

  test("acks a conflict when the atomic write matched nothing", async () => {
    access.hasAccess.mockResolvedValue(true)
    model.editorLocks.findLiveLocks.mockResolvedValue([])
    model.conversations.getById.mockResolvedValue([{ text: [FIRST, SECOND] }])
    model.conversations.mergeEditorTurns.mockResolvedValue(null)
    const ctx = joinedCtx()
    const ack = jest.fn()

    await onMergeTurns(ctx, PAYLOAD, ack)

    expect(ctx.emit).not.toHaveBeenCalled()
    expect(ack).toHaveBeenCalledWith({ ok: false, reason: "conflict" })
  })
})

describe("onDeleteTurn", () => {
  const PAYLOAD = { translationId: "tr-1", turnId: "turn-2" }
  const TURNS = [
    { turn_id: "turn-1", speaker_id: "spk-1", segment: "a", words: [] },
    { turn_id: "turn-2", speaker_id: "spk-2", segment: "b", words: [] },
    { turn_id: "turn-3", speaker_id: "spk-1", segment: "c", words: [] },
  ]

  test("deletes, predicts the speaker GC and broadcasts", async () => {
    model.conversations.getById.mockResolvedValue([{ text: TURNS }])
    model.conversations.deleteEditorTurn.mockResolvedValue({ version: 11 })
    const ctx = makeCtx()
    const ack = jest.fn()

    await onDeleteTurn(ctx, PAYLOAD, ack)

    expect(model.conversations.deleteEditorTurn).toHaveBeenCalledWith(
      "tr-1",
      "turn-2",
    )
    // turn-2 was spk-2's only turn: its removal rides the broadcast.
    expect(ctx.io.to).toHaveBeenCalledWith("editor/conv-1")
    expect(ctx.emit).toHaveBeenCalledWith("editor:turn_deleted", {
      translationId: "tr-1",
      turnId: "turn-2",
      removedSpeakerId: "spk-2",
      version: 11,
    })
    expect(ack).toHaveBeenCalledWith({ ok: true, version: 11 })
  })

  test("no speaker GC when the speaker still has other turns", async () => {
    model.conversations.getById.mockResolvedValue([{ text: TURNS }])
    model.conversations.deleteEditorTurn.mockResolvedValue({ version: 12 })
    const ctx = makeCtx()

    await onDeleteTurn(ctx, { ...PAYLOAD, turnId: "turn-1" }, jest.fn())

    const [, broadcast] = ctx.emit.mock.calls[0]
    expect("removedSpeakerId" in broadcast).toBe(false)
  })

  test("refuses to delete the track's last turn", async () => {
    model.conversations.getById.mockResolvedValue([{ text: [TURNS[1]] }])
    const ctx = makeCtx()
    const ack = jest.fn()

    await onDeleteTurn(ctx, PAYLOAD, ack)

    expect(model.conversations.deleteEditorTurn).not.toHaveBeenCalled()
    expect(ack).toHaveBeenCalledWith({ ok: false, reason: "last_turn" })
  })

  test("acks a conflict when the turn vanished (read or write)", async () => {
    model.conversations.getById.mockResolvedValue([{ text: [TURNS[0], TURNS[2]] }])
    const ctx = makeCtx()
    const ack1 = jest.fn()
    await onDeleteTurn(ctx, PAYLOAD, ack1)
    expect(ack1).toHaveBeenCalledWith({ ok: false, reason: "conflict" })

    model.conversations.getById.mockResolvedValue([{ text: TURNS }])
    model.conversations.deleteEditorTurn.mockResolvedValue(null)
    const ack2 = jest.fn()
    await onDeleteTurn(ctx, PAYLOAD, ack2)
    expect(ack2).toHaveBeenCalledWith({ ok: false, reason: "conflict" })
  })
})
