jest.mock(
  `${process.cwd()}/components/WebServer/middlewares/access/conversation`,
  () => ({ hasAccess: jest.fn() }),
)
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  editorLocks: {
    acquire: jest.fn(),
    release: jest.fn(),
    releaseAllForSocket: jest.fn(),
  },
}))

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
const { onLockTurn: rawOnLockTurn } = require(
  `${process.cwd()}/components/EditorHandler/handlers/onLockTurn`,
)
// Production wiring: lock_turn goes through requireWrite (heartbeat = the
// WRITE re-check), so the composed handler is what gets tested here.
const onLockTurn = requireWrite(rawOnLockTurn)
const { onUnlockTurn } = require(
  `${process.cwd()}/components/EditorHandler/handlers/onUnlockTurn`,
)
const { onDisconnect } = require(
  `${process.cwd()}/components/EditorHandler/handlers/onDisconnect`,
)

const PAYLOAD = { translationId: "tr-1", turnId: "turn-1" }

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
      join: jest.fn(),
      leave: jest.fn(),
    },
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  access.hasAccess.mockResolvedValue(true)
})

describe("onLockTurn", () => {
  test("acquires, acks ok and broadcasts turn_locked to the parent room", async () => {
    model.editorLocks.acquire.mockResolvedValue({
      acquired: true,
      refreshed: false,
    })
    const ctx = makeCtx()
    const ack = jest.fn()

    await onLockTurn(ctx, PAYLOAD, ack)

    expect(access.hasAccess).toHaveBeenCalledWith(
      "tr-1",
      "user-1",
      CONVERSATION_RIGHTS.WRITE,
    )
    expect(model.editorLocks.acquire).toHaveBeenCalledWith({
      parentId: "conv-1",
      translationId: "tr-1",
      turnId: "turn-1",
      userId: "user-1",
      socketId: "sock-1",
      userName: "Marie Dupont",
    })
    expect(ctx.io.to).toHaveBeenCalledWith("editor/conv-1")
    expect(ctx.emit).toHaveBeenCalledWith("editor:turn_locked", {
      translationId: "tr-1",
      turnId: "turn-1",
      userId: "user-1",
      userName: "Marie Dupont",
    })
    expect(ack).toHaveBeenCalledWith({ ok: true })
  })

  test("a refresh (heartbeat) acks ok without re-broadcasting", async () => {
    model.editorLocks.acquire.mockResolvedValue({
      acquired: true,
      refreshed: true,
    })
    const ctx = makeCtx()
    const ack = jest.fn()

    await onLockTurn(ctx, PAYLOAD, ack)

    expect(ctx.emit).not.toHaveBeenCalled()
    expect(ack).toHaveBeenCalledWith({ ok: true })
  })

  test("refuses a turn locked by another socket, with the holder", async () => {
    model.editorLocks.acquire.mockResolvedValue({
      acquired: false,
      holder: {
        userId: "user-2",
        userName: "Thomas",
        socketId: "sock-2",
        expiresAt: new Date(),
      },
    })
    const ctx = makeCtx()
    const ack = jest.fn()

    await onLockTurn(ctx, PAYLOAD, ack)

    expect(ctx.emit).not.toHaveBeenCalled()
    expect(ack).toHaveBeenCalledWith({
      ok: false,
      reason: "locked_by_other",
      holder: { userId: "user-2", userName: "Thomas" },
    })
  })

  test("re-checks WRITE on every beat: a revoked right refuses the lock", async () => {
    access.hasAccess.mockResolvedValue(false)
    const ctx = makeCtx()
    const ack = jest.fn()

    await onLockTurn(ctx, PAYLOAD, ack)

    expect(model.editorLocks.acquire).not.toHaveBeenCalled()
    expect(ack).toHaveBeenCalledWith({ ok: false, reason: "forbidden" })
  })

  test("requires a prior join", async () => {
    const ctx = makeCtx({ joined: false })
    const ack = jest.fn()

    await onLockTurn(ctx, PAYLOAD, ack)

    expect(access.hasAccess).not.toHaveBeenCalled()
    expect(ack).toHaveBeenCalledWith({ ok: false, reason: "unauthorized" })
  })

  test("rejects an incomplete payload", async () => {
    const ctx = makeCtx()
    const ack = jest.fn()

    // Missing turnId passes requireWrite (translationId ok) and exercises
    // the handler's own payload validation.
    await onLockTurn(ctx, { translationId: "tr-1" }, ack)

    expect(ack).toHaveBeenCalledWith({ ok: false, reason: "invalid_payload" })
  })

  test("acks an error instead of throwing", async () => {
    model.editorLocks.acquire.mockRejectedValue(new Error("mongo down"))
    const ctx = makeCtx()
    const ack = jest.fn()

    await onLockTurn(ctx, PAYLOAD, ack)

    expect(ack).toHaveBeenCalledWith({ ok: false, reason: "error" })
  })
})

describe("onUnlockTurn", () => {
  test("releases the own lock and broadcasts turn_unlocked", async () => {
    model.editorLocks.release.mockResolvedValue(true)
    const ctx = makeCtx()
    const ack = jest.fn()

    await onUnlockTurn(ctx, PAYLOAD, ack)

    expect(model.editorLocks.release).toHaveBeenCalledWith(
      "tr-1",
      "turn-1",
      "sock-1",
    )
    expect(ctx.io.to).toHaveBeenCalledWith("editor/conv-1")
    expect(ctx.emit).toHaveBeenCalledWith("editor:turn_unlocked", {
      translationId: "tr-1",
      turnId: "turn-1",
    })
    expect(ack).toHaveBeenCalledWith({ ok: true })
  })

  test("refuses to release a lock the socket does not hold", async () => {
    model.editorLocks.release.mockResolvedValue(false)
    const ctx = makeCtx()
    const ack = jest.fn()

    await onUnlockTurn(ctx, PAYLOAD, ack)

    expect(ctx.emit).not.toHaveBeenCalled()
    expect(ack).toHaveBeenCalledWith({ ok: false, reason: "not_lock_owner" })
  })

})

describe("onDisconnect", () => {
  test("releases every lock of the socket and notifies each parent room", async () => {
    model.editorLocks.releaseAllForSocket.mockResolvedValue([
      { parentId: "conv-1", translationId: "tr-1", turnId: "turn-1" },
      { parentId: "conv-2", translationId: "tr-9", turnId: "turn-4" },
    ])
    const ctx = makeCtx()

    await onDisconnect(ctx)

    expect(model.editorLocks.releaseAllForSocket).toHaveBeenCalledWith(
      "sock-1",
      {},
    )
    expect(ctx.io.to).toHaveBeenNthCalledWith(1, "editor/conv-1")
    expect(ctx.io.to).toHaveBeenNthCalledWith(2, "editor/conv-2")
    expect(ctx.emit).toHaveBeenNthCalledWith(1, "editor:turn_unlocked", {
      translationId: "tr-1",
      turnId: "turn-1",
    })
    expect(ctx.emit).toHaveBeenNthCalledWith(2, "editor:turn_unlocked", {
      translationId: "tr-9",
      turnId: "turn-4",
    })
  })

  test("never throws (cleanup failure is logged only)", async () => {
    model.editorLocks.releaseAllForSocket.mockRejectedValue(
      new Error("mongo down"),
    )
    await expect(onDisconnect(makeCtx())).resolves.toBeUndefined()
  })
})
