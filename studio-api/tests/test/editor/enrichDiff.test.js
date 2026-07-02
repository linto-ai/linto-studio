// enrichDiff maps doc words to timestamps BY wid (identity is carried by the
// `word` mark in the Y.Doc). No text-diff, no split/merge detection.
//
// getSyllabic eagerly loads syllabicEN, which pulls the ESM-only `syllable`
// package Jest can't transform. These tests run on the fr-FR path
// (self-contained syllabicFR), so the EN dependency is stubbed.
jest.mock("syllable", () => ({ syllable: () => 1 }))

const {
  enrichDiff,
} = require(`${process.cwd()}/components/EditorHandler/flush/enrichDiff`)

// Old Mongo turn (words carry timestamps).
function oldTurn(turn_id, words, extra = {}) {
  const segment = words
    .filter((w) => w.word !== "")
    .map((w) => w.word)
    .join(" ")
  return {
    turn_id,
    speaker_id: "spk",
    language: "fr-FR",
    segment,
    raw_segment: segment,
    words,
    ...extra,
  }
}
// New doc turn (words carry identity only: wid + word).
function docTurn(turn_id, widWords, extra = {}) {
  const segment = widWords.map((w) => w.word).join(" ")
  return {
    turn_id,
    speaker_id: "spk",
    language: "fr-FR",
    segment,
    words: widWords,
    ...extra,
  }
}
const w = (wid, s, e, word) => ({ wid, stime: s, etime: e, word })
const dw = (wid, word) => ({ wid, word })

describe("enrichDiff (wid mapping)", () => {
  test("unchanged turn: timestamps kept, words array reused by reference, not dirty", () => {
    const old = [oldTurn("t1", [w("a", 0, 1, "hello"), w("b", 1, 2, "world")])]
    const next = [docTurn("t1", [dw("a", "hello"), dw("b", "world")])]

    const { finalTurns, changedTurns, hasChanges } = enrichDiff(old, next)

    expect(hasChanges).toBe(false)
    expect(changedTurns).toEqual([])
    // Reference reuse (cheap unchanged detection downstream).
    expect(finalTurns[0].words).toBe(old[0].words)
  })

  test("edited word keeps its wid timestamp, updates text", () => {
    const old = [oldTurn("t1", [w("a", 0, 1, "helo"), w("b", 1, 2, "world")])]
    const next = [docTurn("t1", [dw("a", "hello"), dw("b", "world")])]

    const { finalTurns, hasChanges } = enrichDiff(old, next)

    expect(hasChanges).toBe(true)
    expect(finalTurns[0].words).toEqual([
      { wid: "a", stime: 0, etime: 1, word: "hello" },
      { wid: "b", stime: 1, etime: 2, word: "world" },
    ])
  })

  test("new word (unknown wid) interpolated into the neighbour gap", () => {
    const old = [oldTurn("t1", [w("a", 0, 1, "a"), w("b", 3, 4, "b")])]
    // "mid" typed between a (etime 1) and b (stime 3).
    const next = [docTurn("t1", [dw("a", "a"), dw("new", "mid"), dw("b", "b")])]

    const { finalTurns } = enrichDiff(old, next)

    const mid = finalTurns[0].words[1]
    expect(mid.wid).toBe("new")
    expect(mid.stime).toBe(1)
    expect(mid.etime).toBe(3)
  })

  test("mid-word split: parent span redistributed by syllables", () => {
    // "bonjour" (0.75-1.35) split into "bon" (keeps wid a) + "jour" (new wid).
    const old = [oldTurn("t1", [w("a", 0.75, 1.35, "bonjour")])]
    const next = [docTurn("t1", [dw("a", "bon"), dw("b", "jour")])]

    const { finalTurns } = enrichDiff(old, next)

    expect(finalTurns[0].words).toEqual([
      { wid: "a", stime: 0.75, etime: 1.05, word: "bon" },
      { wid: "b", stime: 1.05, etime: 1.35, word: "jour" },
    ])
  })

  test("deleted word (wid gone) is dropped", () => {
    const old = [
      oldTurn("t1", [w("a", 0, 1, "a"), w("b", 1, 2, "b"), w("c", 2, 3, "c")]),
    ]
    const next = [docTurn("t1", [dw("a", "a"), dw("c", "c")])]

    const { finalTurns } = enrichDiff(old, next)

    expect(finalTurns[0].words).toEqual([
      { wid: "a", stime: 0, etime: 1, word: "a" },
      { wid: "c", stime: 2, etime: 3, word: "c" },
    ])
  })

  test("turn merge: t2's words fold into t1 with their real timestamps, span extends", () => {
    const old = [
      oldTurn("t1", [w("a", 0, 1, "hello"), w("b", 1, 2, "world")], { stime: 0, etime: 2 }),
      oldTurn("t2", [w("c", 2, 3, "foo"), w("d", 3, 4, "bar")], { stime: 2, etime: 4 }),
    ]
    // Backspace-join: t1 now holds all four wids (words stay mark-delimited,
    // no gluing), t2 gone.
    const next = [
      docTurn("t1", [dw("a", "hello"), dw("b", "world"), dw("c", "foo"), dw("d", "bar")]),
    ]

    const { finalTurns, hasChanges } = enrichDiff(old, next)

    expect(hasChanges).toBe(true)
    expect(finalTurns).toHaveLength(1)
    expect(finalTurns[0].words).toEqual([
      { wid: "a", stime: 0, etime: 1, word: "hello" },
      { wid: "b", stime: 1, etime: 2, word: "world" },
      { wid: "c", stime: 2, etime: 3, word: "foo" },
      { wid: "d", stime: 3, etime: 4, word: "bar" },
    ])
    expect(finalTurns[0].stime).toBe(0)
    expect(finalTurns[0].etime).toBe(4)
  })

  test("turn split: wids partitioned across turns keep their timestamps", () => {
    const old = [
      oldTurn("t1", [
        w("a", 0, 1, "a"),
        w("b", 1, 2, "b"),
        w("c", 2, 3, "c"),
        w("d", 3, 4, "d"),
      ]),
    ]
    const next = [
      docTurn("t1", [dw("a", "a"), dw("b", "b")]),
      docTurn("t2", [dw("c", "c"), dw("d", "d")]),
    ]

    const { finalTurns, hasChanges } = enrichDiff(old, next)

    expect(hasChanges).toBe(true)
    expect(finalTurns).toHaveLength(2)
    expect(finalTurns[0].words).toEqual([
      { wid: "a", stime: 0, etime: 1, word: "a" },
      { wid: "b", stime: 1, etime: 2, word: "b" },
    ])
    expect(finalTurns[1].words).toEqual([
      { wid: "c", stime: 2, etime: 3, word: "c" },
      { wid: "d", stime: 3, etime: 4, word: "d" },
    ])
  })

  test("fresh turn typed from scratch (all unknown wids): no timestamps to invent", () => {
    const old = [oldTurn("t1", [w("a", 0, 1, "a")])]
    const next = [
      docTurn("t1", [dw("a", "a")]),
      docTurn("t2", [dw("x", "brand"), dw("y", "new")]),
    ]

    const { finalTurns, hasChanges } = enrichDiff(old, next)

    expect(hasChanges).toBe(true)
    expect(finalTurns[1].turn_id).toBe("t2")
    // No anchor and no turn bounds → degenerate zero-length at 0 (best effort).
    expect(finalTurns[1].words.map((x) => x.wid)).toEqual(["x", "y"])
  })

  test("speaker change on an otherwise identical turn is dirty", () => {
    const old = [oldTurn("t1", [w("a", 0, 1, "a")])]
    const next = [docTurn("t1", [dw("a", "a")], { speaker_id: "spk-OTHER" })]

    const { finalTurns, hasChanges } = enrichDiff(old, next)

    expect(hasChanges).toBe(true)
    expect(finalTurns[0].speaker_id).toBe("spk-OTHER")
  })

  // ASR sometimes emits no per-word timing — only turn-level stime/etime.
  test("words without timestamps: turn-level times survive a flush unchanged", () => {
    const old = [
      {
        turn_id: "t1",
        speaker_id: "spk",
        language: "fr-FR",
        segment: "hello world",
        raw_segment: "hello world",
        words: [{ wid: "a", word: "hello" }, { wid: "b", word: "world" }],
        stime: 5,
        etime: 9,
      },
    ]
    const next = [
      docTurn("t1", [dw("a", "hello"), dw("b", "world")], { stime: 5, etime: 9 }),
    ]

    const { finalTurns } = enrichDiff(old, next)

    expect(finalTurns[0].stime).toBe(5)
    expect(finalTurns[0].etime).toBe(9)
    expect(finalTurns[0].words).toEqual([
      { wid: "a", word: "hello" },
      { wid: "b", word: "world" },
    ])
  })

  test("words without timestamps: editing a word keeps the turn times", () => {
    const old = [
      {
        turn_id: "t1",
        speaker_id: "spk",
        language: "fr-FR",
        segment: "helo world",
        raw_segment: "helo world",
        words: [{ wid: "a", word: "helo" }, { wid: "b", word: "world" }],
        stime: 5,
        etime: 9,
      },
    ]
    const next = [
      docTurn("t1", [dw("a", "hello"), dw("b", "world")], { stime: 5, etime: 9 }),
    ]

    const { finalTurns, hasChanges } = enrichDiff(old, next)

    expect(hasChanges).toBe(true)
    expect(finalTurns[0].stime).toBe(5)
    expect(finalTurns[0].etime).toBe(9)
    // The edited word (a) is filled from the turn span; the sibling stays timeless.
    expect(finalTurns[0].words).toEqual([
      { wid: "a", stime: 5, etime: 9, word: "hello" },
      { wid: "b", word: "world" },
    ])
  })

  // Legacy transcripts (transcribed before per-word wid): Mongo words have real
  // timing but NO wid; the migration reseed mints fresh wids that can't match by
  // id. Timing must be recovered by TEXT, not destroyed by interpolation.
  test("legacy words without wid: timing recovered by text when reseed mints fresh wids", () => {
    const old = [
      {
        turn_id: "t1",
        speaker_id: "spk",
        language: "fr-FR",
        segment: "hello world",
        raw_segment: "hello world",
        words: [
          { word: "hello", stime: 1.0, etime: 1.4 },
          { word: "world", stime: 3.0, etime: 3.6 },
        ],
        stime: 1.0,
        etime: 3.6,
      },
    ]
    const next = [
      docTurn("t1", [dw("new1", "hello"), dw("new2", "world")], {
        stime: 1.0,
        etime: 3.6,
      }),
    ]

    const { finalTurns } = enrichDiff(old, next)

    // Real timings + the mid-turn silence preserved (NOT interpolated 1.0-2.x).
    expect(finalTurns[0].words).toEqual([
      { word: "hello", stime: 1.0, etime: 1.4, wid: "new1" },
      { word: "world", stime: 3.0, etime: 3.6, wid: "new2" },
    ])
  })

  test("duplicate wid in the doc: the second occurrence does not steal the first's timing", () => {
    const old = [oldTurn("t1", [w("a", 0, 1, "hello"), w("b", 1, 2, "world")])]
    // A copy/paste of a marked run leaves two doc words carrying wid "a".
    const next = [docTurn("t1", [dw("a", "hello"), dw("a", "hello")])]

    const { finalTurns } = enrichDiff(old, next)
    const ws = finalTurns[0].words

    expect(ws[0]).toEqual({ wid: "a", stime: 0, etime: 1, word: "hello" })
    // Second must NOT be an identical clone of the first's [0,1] span.
    expect(ws[1].stime === 0 && ws[1].etime === 1).toBe(false)
  })
})
