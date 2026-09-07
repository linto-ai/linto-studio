const { requireFamily } = require(
  `${process.cwd()}/components/EditorHandler/decorators/requireFamily`,
)

function makeCtx({ joined = true } = {}) {
  return {
    io: {},
    socket: {
      id: "sock-1",
      data: joined
        ? {
            editorUser: { userId: "user-1", userName: "Marie" },
            editorParentId: "conv-1",
            editorFamily: new Set(["conv-1", "tr-1", "tr-2"]),
          }
        : {},
    },
  }
}

describe("requireFamily", () => {
  test("runs the handler for a track of the joined family", async () => {
    const handler = jest.fn()
    const ctx = makeCtx()
    const ack = jest.fn()

    await requireFamily(handler)(ctx, { translationId: "tr-1" }, ack)

    expect(handler).toHaveBeenCalledWith(ctx, { translationId: "tr-1" }, ack)
  })

  test("refuses a track OUTSIDE the joined family (spoofed payload)", async () => {
    const handler = jest.fn()
    const ack = jest.fn()

    await requireFamily(handler)(
      makeCtx(),
      { translationId: "tr-of-another-conversation" },
      ack,
    )

    expect(handler).not.toHaveBeenCalled()
    expect(ack).toHaveBeenCalledWith({ ok: false, reason: "forbidden" })
  })

  test("refuses without a prior join and without translationId", async () => {
    const handler = jest.fn()

    const ack1 = jest.fn()
    await requireFamily(handler)(
      makeCtx({ joined: false }),
      { translationId: "tr-1" },
      ack1,
    )
    expect(ack1).toHaveBeenCalledWith({ ok: false, reason: "unauthorized" })

    const ack2 = jest.fn()
    await requireFamily(handler)(makeCtx(), {}, ack2)
    expect(ack2).toHaveBeenCalledWith({ ok: false, reason: "invalid_payload" })

    expect(handler).not.toHaveBeenCalled()
  })

  test("acks an error instead of throwing when the handler fails", async () => {
    const handler = jest.fn().mockRejectedValue(new Error("boom"))
    const ack = jest.fn()

    await requireFamily(handler)(makeCtx(), { translationId: "tr-1" }, ack)

    expect(ack).toHaveBeenCalledWith({ ok: false, reason: "error" })
  })
})
