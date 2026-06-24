// Fresh tests for the flush-time diff orchestrator. No frontend equivalent.
// enrichDiff classifies each new (Y.Doc) turn against the last-flushed Mongo
// state and returns { finalTurns, changedTurns, hasChanges }.
//
// getSyllabic eagerly loads syllabicEN, which pulls the ESM-only `syllable`
// package that Jest can't transform. These tests run on the fr-FR path
// (self-contained syllabicFR), so the EN dependency is stubbed.
jest.mock("syllable", () => ({ syllable: () => 1 }))

const {
  enrichDiff,
} = require(`${process.cwd()}/components/EditorHandler/flush/enrichDiff`)

// A live Mongo turn: word-level timestamps + turn-level stime/etime.
function turn(turn_id, segment, words, stime, etime) {
  const t = { turn_id, speaker_id: "spk", language: "fr-FR", segment, words }
  if (stime !== undefined) t.stime = stime
  if (etime !== undefined) t.etime = etime
  return t
}
function w(wid, stime, etime, word) {
  return { wid, stime, etime, word }
}

describe("enrichDiff", () => {
  test("unchanged turns produce no changes", () => {
    const old = [turn("A", "hello world", [w("w1", 0, 0.5, "hello"), w("w2", 0.5, 1, "world")], 0, 1)]
    const next = [{ turn_id: "A", speaker_id: "spk", language: "fr-FR", segment: "hello world" }]

    const { finalTurns, changedTurns, hasChanges } = enrichDiff(old, next)

    expect(hasChanges).toBe(false)
    expect(changedTurns).toEqual([])
    expect(finalTurns).toHaveLength(1)
    expect(finalTurns[0].words).toEqual(old[0].words)
    expect(finalTurns[0].stime).toBe(0)
    expect(finalTurns[0].etime).toBe(1)
  })

  test("fresh turn (unknown id) gets empty words", () => {
    const old = [turn("A", "hello world", [w("w1", 0, 0.5, "hello"), w("w2", 0.5, 1, "world")], 0, 1)]
    const next = [
      { turn_id: "A", speaker_id: "spk", language: "fr-FR", segment: "hello world" },
      { turn_id: "NEW", speaker_id: "spk", language: "fr-FR", segment: "brand new" },
    ]

    const { finalTurns, changedTurns, hasChanges } = enrichDiff(old, next)

    expect(hasChanges).toBe(true)
    expect(finalTurns[1].turn_id).toBe("NEW")
    expect(finalTurns[1].words).toEqual([])
    expect(changedTurns).toContainEqual({ turn_id: "NEW", words: [] })
  })

  test("deleted turn (old id absent from new) is dropped and flagged dirty", () => {
    const old = [
      turn("A", "hello world", [w("w1", 0, 0.5, "hello"), w("w2", 0.5, 1, "world")], 0, 1),
      turn("B", "foo bar", [w("w3", 1, 1.5, "foo"), w("w4", 1.5, 2, "bar")], 1, 2),
    ]
    const next = [{ turn_id: "A", speaker_id: "spk", language: "fr-FR", segment: "hello world" }]

    const { finalTurns, hasChanges } = enrichDiff(old, next)

    expect(hasChanges).toBe(true)
    expect(finalTurns).toHaveLength(1)
    expect(finalTurns[0].turn_id).toBe("A")
  })

  test("merge B into A: words concatenated, segment joined, span start.stime -> end.etime", () => {
    const old = [
      turn("A", "hello world", [w("w1", 0, 0.5, "hello"), w("w2", 0.5, 1, "world")], 0, 1),
      turn("B", "foo bar", [w("w3", 1, 1.5, "foo"), w("w4", 1.5, 2, "bar")], 1, 2),
    ]
    // TipTap joinBackward keeps the previous turn's id (A).
    const next = [{ turn_id: "A", speaker_id: "spk", language: "fr-FR", segment: "hello world foo bar" }]

    const { finalTurns, changedTurns, hasChanges } = enrichDiff(old, next)

    expect(hasChanges).toBe(true)
    expect(finalTurns).toHaveLength(1)
    const merged = finalTurns[0]
    expect(merged.turn_id).toBe("A")
    expect(merged.segment).toBe("hello world foo bar")
    expect(merged.raw_segment).toBe("hello world foo bar")
    expect(merged.words).toEqual([
      w("w1", 0, 0.5, "hello"),
      w("w2", 0.5, 1, "world"),
      w("w3", 1, 1.5, "foo"),
      w("w4", 1.5, 2, "bar"),
    ])
    // span: first turn's start, last turn's end.
    expect(merged.stime).toBe(0)
    expect(merged.etime).toBe(2)
    expect(changedTurns).toContainEqual({ turn_id: "A", words: merged.words })
  })

  test("cascade merge of 3 turns into 1: span covers first.stime -> last.etime", () => {
    const old = [
      turn("A", "a b", [w("w1", 0, 0.5, "a"), w("w2", 0.5, 1, "b")], 0, 1),
      turn("B", "c d", [w("w3", 1, 1.5, "c"), w("w4", 1.5, 2, "d")], 1, 2),
      turn("C", "e f", [w("w5", 2, 2.5, "e"), w("w6", 2.5, 3, "f")], 2, 3),
    ]
    const next = [{ turn_id: "A", speaker_id: "spk", language: "fr-FR", segment: "a b c d e f" }]

    const { finalTurns, hasChanges } = enrichDiff(old, next)

    expect(hasChanges).toBe(true)
    expect(finalTurns).toHaveLength(1)
    expect(finalTurns[0].turn_id).toBe("A")
    expect(finalTurns[0].words).toHaveLength(6)
    expect(finalTurns[0].stime).toBe(0)
    expect(finalTurns[0].etime).toBe(3)
  })

  test("split A into A + new turn: 1 -> N redistributes words", () => {
    const old = [
      turn(
        "A",
        "hello world foo bar",
        [
          w("w1", 0, 0.5, "hello"),
          w("w2", 0.5, 1, "world"),
          w("w3", 1, 1.5, "foo"),
          w("w4", 1.5, 2, "bar"),
        ],
        0,
        2,
      ),
    ]
    // First half keeps id A, second half gets a fresh id.
    const next = [
      { turn_id: "A", speaker_id: "spk", language: "fr-FR", segment: "hello world" },
      { turn_id: "A2", speaker_id: "spk", language: "fr-FR", segment: "foo bar" },
    ]

    const { finalTurns, hasChanges } = enrichDiff(old, next)

    expect(hasChanges).toBe(true)
    expect(finalTurns).toHaveLength(2)
    expect(finalTurns[0].turn_id).toBe("A")
    expect(finalTurns[0].segment).toBe("hello world")
    expect(finalTurns[0].words.map((x) => x.word)).toEqual(["hello", "world"])
    expect(finalTurns[1].turn_id).toBe("A2")
    expect(finalTurns[1].segment).toBe("foo bar")
    expect(finalTurns[1].words.map((x) => x.word)).toEqual(["foo", "bar"])
  })

  test("speaker change on an otherwise unchanged turn is dirty", () => {
    const old = [turn("A", "hello world", [w("w1", 0, 0.5, "hello"), w("w2", 0.5, 1, "world")], 0, 1)]
    const next = [{ turn_id: "A", speaker_id: "spk-OTHER", language: "fr-FR", segment: "hello world" }]

    const { finalTurns, hasChanges } = enrichDiff(old, next)

    expect(hasChanges).toBe(true)
    expect(finalTurns[0].speaker_id).toBe("spk-OTHER")
  })
})
