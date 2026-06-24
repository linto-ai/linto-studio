// Server mergeTurn semantics. The frontend equivalent had a different
// signature (start, end, syllabic) and kept the end turn's id with no
// raw_segment nor turn-level time spanning, so these are fresh tests.
const {
  mergeTurn,
} = require(`${process.cwd()}/components/EditorHandler/words/mergeTurn`)

// Two adjacent turns, distinct speakers, word-level timestamps only.
function fixtures() {
  const startTurn = {
    turn_id: "start",
    speaker_id: "spk-A",
    segment: "hello world",
    words: [
      { wid: "w1", stime: 0.0, etime: 0.5, word: "hello" },
      { wid: "w2", stime: 0.5, etime: 1.0, word: "world" },
    ],
  }
  const endTurn = {
    turn_id: "end",
    speaker_id: "spk-B",
    segment: "foo bar",
    words: [
      { wid: "w3", stime: 1.0, etime: 1.5, word: "foo" },
      { wid: "w4", stime: 1.5, etime: 2.0, word: "bar" },
    ],
  }
  return { startTurn, endTurn }
}

const mergedWords = [
  { wid: "w1", stime: 0.0, etime: 0.5, word: "hello" },
  { wid: "w2", stime: 0.5, etime: 1.0, word: "world" },
  { wid: "w3", stime: 1.0, etime: 1.5, word: "foo" },
  { wid: "w4", stime: 1.5, etime: 2.0, word: "bar" },
]

describe("mergeTurn", () => {
  test("concatenates words verbatim and joins segments (no timestamp recompute)", () => {
    const { startTurn, endTurn } = fixtures()
    const merged = mergeTurn(startTurn, endTurn, "start")
    expect(merged.words).toEqual(mergedWords)
    expect(merged.segment).toBe("hello world foo bar")
    expect(merged.raw_segment).toBe("hello world foo bar")
  })

  test("survivor = start turn keeps the start turn's id and structural fields", () => {
    const { startTurn, endTurn } = fixtures()
    const merged = mergeTurn(startTurn, endTurn, "start")
    expect(merged).toEqual({
      turn_id: "start",
      speaker_id: "spk-A",
      segment: "hello world foo bar",
      raw_segment: "hello world foo bar",
      words: mergedWords,
    })
  })

  test("survivor = end turn keeps the end turn's id and structural fields", () => {
    const { startTurn, endTurn } = fixtures()
    const merged = mergeTurn(startTurn, endTurn, "end")
    expect(merged).toEqual({
      turn_id: "end",
      speaker_id: "spk-B",
      segment: "hello world foo bar",
      raw_segment: "hello world foo bar",
      words: mergedWords,
    })
  })

  test("turns without turn-level times gain none", () => {
    const { startTurn, endTurn } = fixtures()
    const merged = mergeTurn(startTurn, endTurn, "start")
    expect(merged.stime).toBeUndefined()
    expect(merged.etime).toBeUndefined()
  })

  test("live session: merged turn spans start.stime -> end.etime", () => {
    const { startTurn, endTurn } = fixtures()
    startTurn.stime = 0.0
    startTurn.etime = 1.0
    endTurn.stime = 1.0
    endTurn.etime = 2.0
    const merged = mergeTurn(startTurn, endTurn, "start")
    expect(merged.stime).toBe(0.0)
    expect(merged.etime).toBe(2.0)
  })

  test("span is start->end even when the survivor is the end turn (not the survivor's own span)", () => {
    const { startTurn, endTurn } = fixtures()
    startTurn.stime = 0.0
    startTurn.etime = 1.0
    endTurn.stime = 1.0
    endTurn.etime = 2.0
    const merged = mergeTurn(startTurn, endTurn, "end")
    // base is endTurn (its own span would be 1.0..2.0) but stime must come
    // from the first turn.
    expect(merged.stime).toBe(0.0)
    expect(merged.etime).toBe(2.0)
    expect(merged.turn_id).toBe("end")
  })
})
