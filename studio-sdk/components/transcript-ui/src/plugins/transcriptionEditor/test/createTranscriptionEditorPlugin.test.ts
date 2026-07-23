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

describe("createTranscriptionEditorPlugin — applyTurnUpdate", () => {
  const UPDATE = {
    translationId: "tr-1",
    turnId: "turn-1",
    text: "Bonjour tout le monde",
    words: [
      { word: "Bonjour", stime: 0, etime: 0.8 },
      { word: "tout", stime: 0.9, etime: 1.1 },
      { word: "le", stime: 1.2, etime: 1.3 },
      { word: "monde", stime: 1.4, etime: 1.8 },
    ],
    stime: 0,
    etime: 1.8,
    version: 3,
  }

  it("applies the server truth: positional words, text null, turn times", () => {
    const core = makeEditorCore()
    core.transcriptionEditor!.applyTurnUpdate(UPDATE)

    const turn = core.activeChannel.value!.sourceTranslation.getTurn("turn-1")!
    expect(turn.text).toBeNull()
    expect(turn.words.map((w) => w.id)).toEqual([
      "turn-1#0",
      "turn-1#1",
      "turn-1#2",
      "turn-1#3",
    ])
    expect(turn.words[1]).toMatchObject({
      text: "tout",
      startTime: 0.9,
      charStart: 8,
    })
    expect(turn.startTime).toBe(0)
    expect(turn.endTime).toBe(1.8)
  })

  it("ignores an update for the turn being edited here (typing must survive)", async () => {
    const core = makeEditorCore()
    await core.transcriptionEditor!.beginEdit("turn-1")
    core.transcriptionEditor!.applyTurnUpdate(UPDATE)

    const turn = core.activeChannel.value!.sourceTranslation.getTurn("turn-1")!
    expect(turn.text).toBe("text of turn-1")
    expect(turn.words).toEqual([])
    expect(core.transcriptionEditor!.editingTurnId.value).toBe("turn-1")
  })

  it("ignores unknown turns and unknown translations (unloaded tracks)", () => {
    const core = makeEditorCore()
    const before = core.activeChannel.value!.sourceTranslation.turns.value.length

    core.transcriptionEditor!.applyTurnUpdate({ ...UPDATE, turnId: "turn-404" })
    core.transcriptionEditor!.applyTurnUpdate({
      ...UPDATE,
      translationId: "tr-unloaded",
    })

    expect(core.activeChannel.value!.sourceTranslation.turns.value).toHaveLength(
      before,
    )
    expect(
      core.activeChannel.value!.sourceTranslation.getTurn("turn-1")?.words,
    ).toEqual([])
  })
})

describe("createTranscriptionEditorPlugin — splitTurn", () => {
  it("saves then splits then unlocks, with the caret offset normalized", async () => {
    const order: string[] = []
    let splitPayload: unknown
    const core = makeEditorCore({
      lockTurn: async () => GRANTED,
      saveTurn: async () => {
        order.push("save")
        return { ok: true }
      },
      splitTurn: async (payload) => {
        order.push("split")
        splitPayload = payload
        return { ok: true }
      },
      unlockTurn: async () => {
        order.push("unlock")
        return { ok: true }
      },
    })

    await core.transcriptionEditor!.beginEdit("turn-1")
    // "texte  modifié ici" (double space) — caret raw 8 → normalized 7
    core.transcriptionEditor!.splitTurn("texte  modifié ici", 8)
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(order).toEqual(["save", "split", "unlock"])
    expect(splitPayload).toEqual({
      translationId: "tr-1",
      turnId: "turn-1",
      offset: 7,
    })
    // The optimistic save applied; the split itself waits for the broadcast.
    const turns = core.activeChannel.value!.sourceTranslation.turns.value
    expect(turns).toHaveLength(3)
  })

  it("skips the save push when the text is unchanged", async () => {
    const order: string[] = []
    const core = makeEditorCore({
      lockTurn: async () => GRANTED,
      saveTurn: async () => {
        order.push("save")
        return { ok: true }
      },
      splitTurn: async () => {
        order.push("split")
        return { ok: true }
      },
      unlockTurn: async () => {
        order.push("unlock")
        return { ok: true }
      },
    })

    await core.transcriptionEditor!.beginEdit("turn-1")
    core.transcriptionEditor!.splitTurn("text of turn-1", 5)
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(order).toEqual(["split", "unlock"])
  })

  it("degrades a border-offset split to a plain save", async () => {
    const order: string[] = []
    const core = makeEditorCore({
      lockTurn: async () => GRANTED,
      saveTurn: async () => {
        order.push("save")
        return { ok: true }
      },
      splitTurn: async () => {
        order.push("split")
        return { ok: true }
      },
      unlockTurn: async () => {
        order.push("unlock")
        return { ok: true }
      },
    })

    await core.transcriptionEditor!.beginEdit("turn-1")
    core.transcriptionEditor!.splitTurn("texte modifié", 0)
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(order).toEqual(["save", "unlock"])
  })

  it("aborts the split (but still unlocks) when the save is rejected", async () => {
    const order: string[] = []
    const core = makeEditorCore({
      lockTurn: async () => GRANTED,
      saveTurn: async () => {
        order.push("save")
        return { ok: false, reason: "conflict" }
      },
      splitTurn: async () => {
        order.push("split")
        return { ok: true }
      },
      unlockTurn: async () => {
        order.push("unlock")
        return { ok: true }
      },
    })

    await core.transcriptionEditor!.beginEdit("turn-1")
    core.transcriptionEditor!.splitTurn("texte modifié", 3)
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(order).toEqual(["save", "unlock"])
  })
})

describe("createTranscriptionEditorPlugin — applyTurnSplit", () => {
  const SPLIT = {
    translationId: "tr-1",
    originalTurnId: "turn-2",
    turns: [
      {
        turnId: "turn-2",
        text: "première moitié",
        words: [
          { word: "première", stime: 0, etime: 1 },
          { word: "moitié", stime: 1, etime: 2 },
        ],
        stime: 0,
        etime: 2,
        speakerId: "spk-2",
        language: "fr",
      },
      {
        turnId: "turn-new",
        text: "seconde moitié",
        words: [
          { word: "seconde", stime: 2, etime: 3 },
          { word: "moitié", stime: 3, etime: 4 },
        ],
        stime: 2,
        etime: 4,
        speakerId: "spk-2",
        language: "fr",
      },
    ],
    version: 5,
  }

  it("replaces the original turn by its two halves, in place", () => {
    const core = makeEditorCore()
    core.transcriptionEditor!.applyTurnSplit(SPLIT)

    const turns = core.activeChannel.value!.sourceTranslation.turns.value
    expect(turns.map((t) => t.id)).toEqual(["turn-1", "turn-2", "turn-new", "turn-3"])
    const right = core.activeChannel.value!.sourceTranslation.getTurn("turn-new")!
    expect(right.words.map((w) => w.id)).toEqual(["turn-new#0", "turn-new#1"])
    expect(right.startTime).toBe(2)
    expect(right.speakerId).toBe("spk-2")
  })

  it("ignores a split for an unknown turn or an unloaded track", () => {
    const core = makeEditorCore()
    core.transcriptionEditor!.applyTurnSplit({
      ...SPLIT,
      originalTurnId: "turn-404",
    })
    core.transcriptionEditor!.applyTurnSplit({
      ...SPLIT,
      translationId: "tr-unloaded",
    })

    expect(
      core.activeChannel.value!.sourceTranslation.turns.value,
    ).toHaveLength(3)
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
