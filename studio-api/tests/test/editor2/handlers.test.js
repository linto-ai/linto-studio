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
  test("acks ok (PoC: no persistence)", () => {
    const ctx = makeCtx()
    const ack = jest.fn()
    onUpdateTurn(ctx, { translationId: "tr-1", turnId: "t-1", text: "x" }, ack)
    expect(ack).toHaveBeenCalledWith({ ok: true })
  })
})
