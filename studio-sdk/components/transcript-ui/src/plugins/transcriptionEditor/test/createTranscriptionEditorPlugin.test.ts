import { describe, expect, it } from "bun:test"
import { createTranscriptionEditorPlugin } from "../index"
import type { TranscriptionEditorOptions } from "../index"
import { makeTestCore } from "../../../core/helpers/test/makeTestCore"
import type { Core } from "../../../core/types"

function makeEditorCore(options?: TranscriptionEditorOptions): Core {
  const core = makeTestCore()
  core.use(createTranscriptionEditorPlugin(options))
  return core
}

const GRANTED = { ok: true }
const REFUSED = {
  ok: false,
  reason: "locked_by_other",
  holder: { userId: "user-2", userName: "Thomas" },
}

describe("createTranscriptionEditorPlugin — local-only (no handlers)", () => {
  it("enters edit mode and commits locally", async () => {
    const core = makeEditorCore()
    await core.transcriptionEditor!.beginEdit("turn-1", 3)
    expect(core.transcriptionEditor!.editingTurnId.value).toBe("turn-1")
    expect(core.transcriptionEditor!.editingCaretOffset.value).toBe(3)

    core.transcriptionEditor!.saveTurn("nouveau texte du turn")
    expect(core.transcriptionEditor!.editingTurnId.value).toBeNull()
    const turn = core.activeChannel.value!.sourceTranslation.getTurn("turn-1")
    expect(turn?.words.map((w) => w.text)).toEqual([
      "nouveau",
      "texte",
      "du",
      "turn",
    ])
  })
})

describe("createTranscriptionEditorPlugin — lock flow", () => {
  it("enters edit only once the lock is granted, with the track id", async () => {
    const lockCalls: unknown[] = []
    const core = makeEditorCore({
      lockTurn: async (payload) => {
        lockCalls.push(payload)
        return GRANTED
      },
    })

    await core.transcriptionEditor!.beginEdit("turn-1")

    expect(lockCalls).toEqual([{ translationId: "tr-1", turnId: "turn-1" }])
    expect(core.transcriptionEditor!.editingTurnId.value).toBe("turn-1")
  })

  it("stays out of edit mode on refusal and records the holder", async () => {
    const core = makeEditorCore({ lockTurn: async () => REFUSED })

    await core.transcriptionEditor!.beginEdit("turn-1")

    expect(core.transcriptionEditor!.editingTurnId.value).toBeNull()
    expect(core.transcriptionEditor!.getTurnLock("turn-1")).toEqual({
      userId: "user-2",
      userName: "Thomas",
    })
  })

  it("pre-checks known locks locally (no server round-trip)", async () => {
    let called = 0
    const core = makeEditorCore({
      lockTurn: async () => {
        called++
        return GRANTED
      },
    })
    core.transcriptionEditor!.setTurnLock({
      translationId: "tr-1",
      turnId: "turn-1",
      userId: "user-2",
      userName: "Thomas",
    })

    await core.transcriptionEditor!.beginEdit("turn-1")

    expect(called).toBe(0)
    expect(core.transcriptionEditor!.editingTurnId.value).toBeNull()
  })

  it("ignores re-entrant beginEdit while a lock request is in flight", async () => {
    let calls = 0
    let release: (v: { ok: boolean }) => void
    const pending = new Promise<{ ok: boolean }>((resolve) => {
      release = resolve
    })
    const core = makeEditorCore({
      lockTurn: () => {
        calls++
        return pending
      },
    })

    const first = core.transcriptionEditor!.beginEdit("turn-1")
    const second = core.transcriptionEditor!.beginEdit("turn-2")
    release!(GRANTED)
    await Promise.all([first, second])

    expect(calls).toBe(1)
    expect(core.transcriptionEditor!.editingTurnId.value).toBe("turn-1")
  })

  it("saves then unlocks, in that order (update_turn requires the lock)", async () => {
    const order: string[] = []
    const core = makeEditorCore({
      lockTurn: async () => GRANTED,
      saveTurn: async () => {
        order.push("save")
        return { ok: true }
      },
      unlockTurn: async () => {
        order.push("unlock")
        return { ok: true }
      },
    })

    await core.transcriptionEditor!.beginEdit("turn-1")
    core.transcriptionEditor!.saveTurn("texte modifié")
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(order).toEqual(["save", "unlock"])
  })

  it("unlocks without saving when the text is unchanged", async () => {
    const order: string[] = []
    const core = makeEditorCore({
      lockTurn: async () => GRANTED,
      saveTurn: async () => {
        order.push("save")
        return { ok: true }
      },
      unlockTurn: async () => {
        order.push("unlock")
        return { ok: true }
      },
    })

    await core.transcriptionEditor!.beginEdit("turn-1")
    core.transcriptionEditor!.saveTurn("text of turn-1")
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(order).toEqual(["unlock"])
  })

  it("cancelEdit releases the lock and clears the own-lock entry", async () => {
    let unlocked = 0
    const core = makeEditorCore({
      lockTurn: async () => GRANTED,
      unlockTurn: async () => {
        unlocked++
        return { ok: true }
      },
    })

    await core.transcriptionEditor!.beginEdit("turn-1")
    core.transcriptionEditor!.setTurnLock({
      translationId: "tr-1",
      turnId: "turn-1",
      userId: "user-me",
      userName: "Moi",
    })
    core.transcriptionEditor!.cancelEdit()
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(unlocked).toBe(1)
    expect(core.transcriptionEditor!.editingTurnId.value).toBeNull()
    expect(core.transcriptionEditor!.getTurnLock("turn-1")).toBeUndefined()
  })
})

describe("createTranscriptionEditorPlugin — locks state", () => {
  it("setLocks replaces the whole map; getTurnLock resolves the active track", () => {
    const core = makeEditorCore()
    core.transcriptionEditor!.setTurnLock({
      translationId: "tr-1",
      turnId: "turn-9",
      userId: "u",
      userName: "N",
    })
    core.transcriptionEditor!.setLocks([
      {
        translationId: "tr-1",
        turnId: "turn-2",
        userId: "user-2",
        userName: "Thomas",
      },
      {
        translationId: "tr-OTHER",
        turnId: "turn-1",
        userId: "user-3",
        userName: "Julie",
      },
    ])

    expect(core.transcriptionEditor!.getTurnLock("turn-9")).toBeUndefined()
    expect(core.transcriptionEditor!.getTurnLock("turn-2")?.userName).toBe(
      "Thomas",
    )
    // Locked on another track: invisible on the active one.
    expect(core.transcriptionEditor!.getTurnLock("turn-1")).toBeUndefined()
  })

  it("clearTurnLock removes a single entry", () => {
    const core = makeEditorCore()
    core.transcriptionEditor!.setTurnLock({
      translationId: "tr-1",
      turnId: "turn-2",
      userId: "user-2",
      userName: "Thomas",
    })
    core.transcriptionEditor!.clearTurnLock({
      translationId: "tr-1",
      turnId: "turn-2",
    })
    expect(core.transcriptionEditor!.getTurnLock("turn-2")).toBeUndefined()
  })
})
