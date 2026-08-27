import { describe, expect, it } from "bun:test"
import { createTranscriptionEditorPlugin } from "../index"
import type { TranscriptionEditorOptions } from "../index"
import { makeTestCore } from "@linto-ai/transcript-ui-core/test-utils"
import type { Core } from "@linto-ai/transcript-ui-core"

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

  it("emits the edit events setTurns stays silent about", () => {
    const core = makeEditorCore()
    const events: string[] = []
    core.on("turn:update", ({ turn }) => events.push(`update:${turn.id}`))
    core.on("turn:add", ({ turn }) => events.push(`add:${turn.id}`))

    core.transcriptionEditor!.applyTurnSplit(SPLIT)

    expect(events).toEqual(["update:turn-2", "add:turn-new"])
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

describe("createTranscriptionEditorPlugin — mergeTurns", () => {
  it("pushes the merge for two free turns of the active track", async () => {
    let payload: unknown
    const core = makeEditorCore({
      mergeTurns: async (p) => {
        payload = p
        return { ok: true }
      },
    })

    core.transcriptionEditor!.mergeTurns("turn-1", "turn-2")
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(payload).toEqual({
      translationId: "tr-1",
      firstTurnId: "turn-1",
      secondTurnId: "turn-2",
    })
  })

  it("refuses locally when either turn is locked (own lock included)", async () => {
    let called = 0
    const core = makeEditorCore({
      mergeTurns: async () => {
        called++
        return { ok: true }
      },
    })
    core.transcriptionEditor!.setTurnLock({
      translationId: "tr-1",
      turnId: "turn-2",
      userId: "user-2",
      userName: "Thomas",
    })

    core.transcriptionEditor!.mergeTurns("turn-1", "turn-2")
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(called).toBe(0)
  })

  it("ignores unknown turns", async () => {
    let called = 0
    const core = makeEditorCore({
      mergeTurns: async () => {
        called++
        return { ok: true }
      },
    })

    core.transcriptionEditor!.mergeTurns("turn-1", "turn-404")
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(called).toBe(0)
  })
})

describe("createTranscriptionEditorPlugin — applyTurnsMerged", () => {
  const MERGE = {
    translationId: "tr-1",
    mergedTurnId: "turn-2",
    removedTurnId: "turn-1",
    turn: {
      turnId: "turn-2",
      text: "texte fusionné complet",
      words: [
        { word: "texte", stime: 0, etime: 1 },
        { word: "fusionné", stime: 1, etime: 2 },
        { word: "complet", stime: 2, etime: 3 },
      ],
      stime: 0,
      etime: 3,
      speakerId: "spk-2",
      language: "fr",
    },
    version: 6,
  }

  it("replaces the surviving turn and drops the other", () => {
    const core = makeEditorCore()
    core.transcriptionEditor!.applyTurnsMerged(MERGE)

    const turns = core.activeChannel.value!.sourceTranslation.turns.value
    expect(turns.map((t) => t.id)).toEqual(["turn-2", "turn-3"])
    const merged = core.activeChannel.value!.sourceTranslation.getTurn("turn-2")!
    expect(merged.words.map((w) => w.id)).toEqual([
      "turn-2#0",
      "turn-2#1",
      "turn-2#2",
    ])
    expect(merged.speakerId).toBe("spk-2")
    expect(merged.endTime).toBe(3)
  })

  it("emits the edit events setTurns stays silent about", () => {
    const core = makeEditorCore()
    const events: string[] = []
    core.on("turn:update", ({ turn }) => events.push(`update:${turn.id}`))
    core.on("turn:remove", ({ turnId }) => events.push(`remove:${turnId}`))

    core.transcriptionEditor!.applyTurnsMerged(MERGE)

    expect(events).toEqual(["update:turn-2", "remove:turn-1"])
  })

  it("ignores a merge for an unknown turn or an unloaded track", () => {
    const core = makeEditorCore()
    core.transcriptionEditor!.applyTurnsMerged({
      ...MERGE,
      mergedTurnId: "turn-404",
    })
    core.transcriptionEditor!.applyTurnsMerged({
      ...MERGE,
      translationId: "tr-unloaded",
    })

    expect(
      core.activeChannel.value!.sourceTranslation.turns.value,
    ).toHaveLength(3)
  })
})

describe("createTranscriptionEditorPlugin — emptied turn means deletion", () => {
  it("deletes then unlocks when an emptied text is committed", async () => {
    const order: string[] = []
    let deletePayload: unknown
    const core = makeEditorCore({
      lockTurn: async () => GRANTED,
      saveTurn: async () => {
        order.push("save")
        return { ok: true }
      },
      deleteTurn: async (p) => {
        order.push("delete")
        deletePayload = p
        return { ok: true }
      },
      unlockTurn: async () => {
        order.push("unlock")
        return { ok: true }
      },
    })

    await core.transcriptionEditor!.beginEdit("turn-2")
    core.transcriptionEditor!.saveTurn("   ")
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(order).toEqual(["delete", "unlock"])
    expect(deletePayload).toEqual({ translationId: "tr-1", turnId: "turn-2" })
    // No local application: the turn_deleted broadcast is the single path.
    expect(core.activeChannel.value!.sourceTranslation.turns.value).toHaveLength(3)
  })

  it("reverts instead of deleting the track's LAST turn", async () => {
    const order: string[] = []
    const core = makeEditorCore({
      lockTurn: async () => GRANTED,
      deleteTurn: async () => {
        order.push("delete")
        return { ok: true }
      },
      unlockTurn: async () => {
        order.push("unlock")
        return { ok: true }
      },
    })
    const store = core.activeChannel.value!.sourceTranslation
    store.setTurns([store.getTurn("turn-1")!])

    await core.transcriptionEditor!.beginEdit("turn-1")
    core.transcriptionEditor!.saveTurn("")
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(order).toEqual(["unlock"])
    expect(store.turns.value).toHaveLength(1)
    expect(store.getTurn("turn-1")?.text).toBe("text of turn-1")
  })

  it("applies the deletion locally without a host handler", async () => {
    const core = makeEditorCore()
    await core.transcriptionEditor!.beginEdit("turn-2")
    core.transcriptionEditor!.saveTurn("")

    const turns = core.activeChannel.value!.sourceTranslation.turns.value
    expect(turns.map((t) => t.id)).toEqual(["turn-1", "turn-3"])
  })

  it("Enter on an emptied turn deletes too (no split)", async () => {
    const order: string[] = []
    const core = makeEditorCore({
      lockTurn: async () => GRANTED,
      deleteTurn: async () => {
        order.push("delete")
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

    await core.transcriptionEditor!.beginEdit("turn-2")
    core.transcriptionEditor!.splitTurn("  ", 1)
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(order).toEqual(["delete", "unlock"])
  })
})

describe("createTranscriptionEditorPlugin — applyTurnDeleted", () => {
  it("removes the turn and GCs the orphaned speaker", () => {
    const core = makeEditorCore()
    core.transcriptionEditor!.applyTurnDeleted({
      translationId: "tr-1",
      turnId: "turn-2",
      removedSpeakerId: "spk-2",
      version: 8,
    })

    const turns = core.activeChannel.value!.sourceTranslation.turns.value
    expect(turns.map((t) => t.id)).toEqual(["turn-1", "turn-3"])
    expect(core.speakers.all.has("spk-2")).toBe(false)
  })

  it("ignores unknown turns and unloaded tracks", () => {
    const core = makeEditorCore()
    core.transcriptionEditor!.applyTurnDeleted({
      translationId: "tr-1",
      turnId: "turn-404",
    })
    core.transcriptionEditor!.applyTurnDeleted({
      translationId: "tr-unloaded",
      turnId: "turn-2",
    })
    expect(
      core.activeChannel.value!.sourceTranslation.turns.value,
    ).toHaveLength(3)
  })
})

describe("createTranscriptionEditorPlugin — speaker commands", () => {
  it("pushes update_turn_speaker with the active track id (existing speaker)", async () => {
    let payload: unknown
    const core = makeEditorCore({
      updateTurnSpeaker: async (p) => {
        payload = p
        return { ok: true }
      },
    })

    core.transcriptionEditor!.updateTurnSpeaker("turn-1", {
      speakerId: "spk-2",
    })
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(payload).toEqual({
      translationId: "tr-1",
      turnId: "turn-1",
      speakerId: "spk-2",
    })
  })

  it("pushes the trimmed name for a creation, and refuses ambiguous targets", async () => {
    const payloads: unknown[] = []
    const core = makeEditorCore({
      updateTurnSpeaker: async (p) => {
        payloads.push(p)
        return { ok: true }
      },
    })

    core.transcriptionEditor!.updateTurnSpeaker("turn-1", {
      speakerName: "  Julie ",
    })
    core.transcriptionEditor!.updateTurnSpeaker("turn-1", {
      speakerId: "spk-2",
      speakerName: "Julie",
    })
    core.transcriptionEditor!.updateTurnSpeaker("turn-1", {})
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(payloads).toEqual([
      { translationId: "tr-1", turnId: "turn-1", speakerName: "Julie" },
    ])
  })

  it("applies locally without a host handler (local-only mode)", () => {
    const core = makeEditorCore()
    core.transcriptionEditor!.updateTurnSpeaker("turn-1", {
      speakerId: "spk-2",
    })
    expect(
      core.activeChannel.value!.sourceTranslation.getTurn("turn-1")?.speakerId,
    ).toBe("spk-2")

    core.transcriptionEditor!.renameSpeaker("spk-2", "Thomas B.")
    expect(core.speakers.all.get("spk-2")?.name).toBe("Thomas B.")
  })

  it("pushes rename and replace with the active track id", async () => {
    const calls: Array<[string, unknown]> = []
    const core = makeEditorCore({
      renameSpeaker: async (p) => {
        calls.push(["rename", p])
        return { ok: true }
      },
      replaceSpeaker: async (p) => {
        calls.push(["replace", p])
        return { ok: true }
      },
    })

    core.transcriptionEditor!.renameSpeaker("spk-1", " Marie D. ")
    core.transcriptionEditor!.replaceSpeaker("spk-1", "spk-2")
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(calls).toEqual([
      [
        "rename",
        { translationId: "tr-1", speakerId: "spk-1", name: "Marie D." },
      ],
      [
        "replace",
        { translationId: "tr-1", fromSpeakerId: "spk-1", toSpeakerId: "spk-2" },
      ],
    ])
    // With handlers, nothing is applied locally (broadcast is the only path).
    expect(core.speakers.all.get("spk-1")?.name).toBe("Marie")
  })
})

describe("createTranscriptionEditorPlugin — speaker applies", () => {
  it("applyTurnSpeakerUpdated assigns, ensures the speaker and GCs the orphan", () => {
    const core = makeEditorCore()
    // turn-2 is spk-2's only turn: reassigning it orphans spk-2.
    core.transcriptionEditor!.applyTurnSpeakerUpdated({
      translationId: "tr-1",
      turnId: "turn-2",
      speaker: { id: "spk-new", name: "Julie" },
      removedSpeakerId: "spk-2",
      version: 4,
    })

    expect(
      core.activeChannel.value!.sourceTranslation.getTurn("turn-2")?.speakerId,
    ).toBe("spk-new")
    expect(core.speakers.all.get("spk-new")?.name).toBe("Julie")
    expect(core.speakers.all.has("spk-2")).toBe(false)
  })

  it("keeps a 'removed' speaker still referenced by a loaded track", () => {
    const core = makeEditorCore()
    // spk-1 holds turn-1 AND turn-3: a per-track removal must not drop it
    // from the global store while a loaded track still references it.
    core.transcriptionEditor!.applyTurnSpeakerUpdated({
      translationId: "tr-1",
      turnId: "turn-1",
      speaker: { id: "spk-2", name: "Thomas" },
      removedSpeakerId: "spk-1",
      version: 5,
    })

    expect(core.speakers.all.has("spk-1")).toBe(true)
  })

  it("applySpeakerRenamed updates the global store", () => {
    const core = makeEditorCore()
    core.transcriptionEditor!.applySpeakerRenamed({
      translationId: "tr-1",
      speakerId: "spk-1",
      name: "Marie Dupont",
      version: 6,
    })
    expect(core.speakers.all.get("spk-1")?.name).toBe("Marie Dupont")
  })

  it("applySpeakerReplaced reassigns the track's turns and drops the source", () => {
    const core = makeEditorCore()
    core.transcriptionEditor!.applySpeakerReplaced({
      translationId: "tr-1",
      fromSpeakerId: "spk-1",
      toSpeakerId: "spk-2",
      version: 7,
    })

    const turns = core.activeChannel.value!.sourceTranslation.turns.value
    expect(turns.every((t) => t.speakerId === "spk-2")).toBe(true)
    expect(core.speakers.all.has("spk-1")).toBe(false)
  })
})

describe("createTranscriptionEditorPlugin — version safety net", () => {
  function makeUpdate(version: number) {
    return {
      translationId: "tr-1",
      turnId: "turn-1",
      text: "texte serveur",
      words: [{ word: "texte" }, { word: "serveur" }],
      version,
    }
  }

  it("applies sequential versions and skips stale broadcasts", () => {
    const core = makeEditorCore()
    core.transcriptionEditor!.setTranslationVersion("tr-1", 5)

    // v6: nominal — applied.
    core.transcriptionEditor!.applyTurnUpdate(makeUpdate(6))
    const turn = core.activeChannel.value!.sourceTranslation.getTurn("turn-1")!
    expect(turn.words.map((w) => w.text)).toEqual(["texte", "serveur"])

    // v6 again (duplicate) and v4 (old): skipped.
    core.transcriptionEditor!.applyTurnUpdate({
      ...makeUpdate(6),
      text: "doublon",
      words: [{ word: "doublon" }],
    })
    expect(
      core.activeChannel.value!.sourceTranslation.getTurn("turn-1")!.words[0]!
        .text,
    ).toBe("texte")
  })

  it("a version gap skips the apply and asks the host to refetch — once", async () => {
    const refetched: string[] = []
    const core = makeEditorCore({
      refetchTranslation: async (translationId) => {
        refetched.push(translationId)
      },
    })
    core.transcriptionEditor!.setTranslationVersion("tr-1", 5)

    // v8 and v9 arrive after missed v6/v7: one refetch, no application.
    core.transcriptionEditor!.applyTurnUpdate(makeUpdate(8))
    core.transcriptionEditor!.applyTurnUpdate(makeUpdate(9))
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(refetched).toEqual(["tr-1"])
    expect(
      core.activeChannel.value!.sourceTranslation.getTurn("turn-1")!.words,
    ).toEqual([])
  })

  it("untracked tracks apply as before (no baseline yet)", () => {
    const core = makeEditorCore()
    core.transcriptionEditor!.applyTurnUpdate(makeUpdate(42))
    expect(
      core.activeChannel.value!.sourceTranslation.getTurn("turn-1")!.words,
    ).toHaveLength(2)
  })

  it("reconcileVersions refetches only the loaded tracks that went stale", async () => {
    const refetched: string[] = []
    const core = makeEditorCore({
      refetchTranslation: async (translationId) => {
        refetched.push(translationId)
      },
    })
    core.transcriptionEditor!.setTranslationVersion("tr-1", 5)

    core.transcriptionEditor!.reconcileVersions({
      "tr-1": 9, // loaded and stale → refetch
      "tr-OTHER": 4, // never loaded → ignored
      "conv-parent": 2, // not a track we hold → ignored
    })
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(refetched).toEqual(["tr-1"])

    // Up to date: nothing happens.
    core.transcriptionEditor!.setTranslationVersion("tr-1", 9)
    core.transcriptionEditor!.reconcileVersions({ "tr-1": 9 })
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(refetched).toEqual(["tr-1"])
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
