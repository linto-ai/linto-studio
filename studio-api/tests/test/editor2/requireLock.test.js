jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  editorLocks: { isHeldBy: jest.fn() },
}))

const model = require(`${process.cwd()}/lib/mongodb/models`)
const { requireLock } = require(
  `${process.cwd()}/components/EditorHandler2/handlers/requireLock`,
)

const PAYLOAD = { parentId: "conv-1", translationId: "tr-1", turnId: "turn-1" }

function makeCtx() {
  return { io: {}, socket: { id: "sock-1", data: {} } }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe("requireLock", () => {
  test("runs the handler when the socket holds a live lock", async () => {
    model.editorLocks.isHeldBy.mockResolvedValue(true)
    const handler = jest.fn()
    const ctx = makeCtx()
    const ack = jest.fn()

    await requireLock(handler)(ctx, PAYLOAD, ack)

    expect(model.editorLocks.isHeldBy).toHaveBeenCalledWith(
      "tr-1",
      "turn-1",
      "sock-1",
    )
    expect(handler).toHaveBeenCalledWith(ctx, PAYLOAD, ack)
  })

  test("refuses the mutation when the lock is not held", async () => {
    model.editorLocks.isHeldBy.mockResolvedValue(false)
    const handler = jest.fn()
    const ack = jest.fn()

    await requireLock(handler)(makeCtx(), PAYLOAD, ack)

    expect(handler).not.toHaveBeenCalled()
    expect(ack).toHaveBeenCalledWith({ ok: false, reason: "not_lock_owner" })
  })

  test("rejects a payload without the lock key", async () => {
    const handler = jest.fn()
    const ack = jest.fn()

    await requireLock(handler)(makeCtx(), { turnId: "turn-1" }, ack)

    expect(model.editorLocks.isHeldBy).not.toHaveBeenCalled()
    expect(handler).not.toHaveBeenCalled()
    expect(ack).toHaveBeenCalledWith({ ok: false, reason: "invalid_payload" })
  })

  test("acks an error instead of throwing when the check fails", async () => {
    model.editorLocks.isHeldBy.mockRejectedValue(new Error("mongo down"))
    const handler = jest.fn()
    const ack = jest.fn()

    await requireLock(handler)(makeCtx(), PAYLOAD, ack)

    expect(handler).not.toHaveBeenCalled()
    expect(ack).toHaveBeenCalledWith({ ok: false, reason: "error" })
  })

  test("catches a handler failure too (single error boundary)", async () => {
    model.editorLocks.isHeldBy.mockResolvedValue(true)
    const handler = jest.fn().mockRejectedValue(new Error("boom"))
    const ack = jest.fn()

    await requireLock(handler)(makeCtx(), PAYLOAD, ack)

    expect(ack).toHaveBeenCalledWith({ ok: false, reason: "error" })
  })
})
