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
  editorLocks: { listByParent: jest.fn(), releaseAllForSocket: jest.fn() },
  conversations: {
    getById: jest.fn(),
    updateEditorTurn: jest.fn(),
    splitEditorTurn: jest.fn(),
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
  `${process.cwd()}/components/EditorHandler2/handlers/onJoin`,
)
const { onLeave } = require(
  `${process.cwd()}/components/EditorHandler2/handlers/onLeave`,
)
const { onUpdateTurn } = require(
  `${process.cwd()}/components/EditorHandler2/handlers/onUpdateTurn`,
)
const { onSplitTurn } = require(
  `${process.cwd()}/components/EditorHandler2/handlers/onSplitTurn`,
)

function makeCtx() {
  const emit = jest.fn()
  return {
    emit,
    io: { to: jest.fn(() => ({ emit })) },
    socket: { id: "sock-1", data: {}, join: jest.fn(), leave: jest.fn() },
  }
}

function authorizeUser() {
  auth.checkSocket.mockResolvedValue({ isAuth: true, userId: "user-1" })
  access.hasAccess.mockResolvedValue(true)
  model.users.getById.mockResolvedValue([
    { firstname: "Marie", lastname: "Dupont" },
  ])
  model.editorLocks.listByParent.mockResolvedValue([])
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
      version: 0,
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
    parentId: "conv-1",
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

  test("rejects a payload without parentId or text", async () => {
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
    parentId: "conv-1",
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
