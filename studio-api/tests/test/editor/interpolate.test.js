const {
  interpolateWordTimes,
} = require(`${process.cwd()}/components/EditorHandler/words/interpolate`)
const SyllabicFR = require(`${process.cwd()}/components/EditorHandler/words/syllabic/syllabicFR`)

const syllabicFr = new SyllabicFR("fr-FR")

describe("interpolateWordTimes", () => {
  test("anchors keep their exact timing, temp fields stripped", () => {
    const words = [
      { wid: "a", stime: 0, etime: 1, word: "a" },
      { wid: "b", stime: 1, etime: 2, word: "b" },
    ]
    interpolateWordTimes(words, undefined, syllabicFr)
    expect(words).toEqual([
      { wid: "a", stime: 0, etime: 1, word: "a" },
      { wid: "b", stime: 1, etime: 2, word: "b" },
    ])
  })

  test("mid-word split budget split proportionally to syllables", () => {
    // "bon"+"jour" fill the budget [0.75, 1.35] (1 syllable each → half/half).
    const words = [
      { wid: "a", word: "bon", _flex: true, _budgetStime: 0.75, _budgetEtime: 1.35 },
      { wid: "b", word: "jour", _flex: true },
    ]
    interpolateWordTimes(words, undefined, syllabicFr)
    expect(words).toEqual([
      { wid: "a", stime: 0.75, etime: 1.05, word: "bon" },
      { wid: "b", stime: 1.05, etime: 1.35, word: "jour" },
    ])
  })

  test("new word interpolated across the neighbour gap", () => {
    const words = [
      { wid: "a", stime: 0, etime: 1, word: "a" },
      { wid: "n", word: "mid", _flex: true },
      { wid: "b", stime: 3, etime: 4, word: "b" },
    ]
    interpolateWordTimes(words, undefined, syllabicFr)
    expect(words[1]).toEqual({ wid: "n", stime: 1, etime: 3, word: "mid" })
  })

  test("leading new word falls back to turn start", () => {
    const words = [
      { wid: "n", word: "intro", _flex: true },
      { wid: "a", stime: 2, etime: 3, word: "a" },
    ]
    interpolateWordTimes(words, { stime: 1, etime: 3 }, syllabicFr)
    expect(words[0]).toEqual({ wid: "n", stime: 1, etime: 2, word: "intro" })
  })

  test("trailing new word falls back to turn end", () => {
    const words = [
      { wid: "a", stime: 1, etime: 2, word: "a" },
      { wid: "n", word: "tail", _flex: true },
    ]
    interpolateWordTimes(words, { stime: 1, etime: 5 }, syllabicFr)
    expect(words[1]).toEqual({ wid: "n", stime: 2, etime: 5, word: "tail" })
  })

  test("fully unanchored turn with no bounds: degenerate zero-length at 0", () => {
    const words = [
      { wid: "x", word: "brand", _flex: true },
      { wid: "y", word: "new", _flex: true },
    ]
    interpolateWordTimes(words, undefined, syllabicFr)
    expect(words).toEqual([
      { wid: "x", stime: 0, etime: 0, word: "brand" },
      { wid: "y", stime: 0, etime: 0, word: "new" },
    ])
  })

  test("inverted turn bounds are clamped (end never before start)", () => {
    const words = [{ wid: "n", word: "x", _flex: true }]
    // turn.etime < turn.stime → clamp end to start, no negative span.
    interpolateWordTimes(words, { stime: 5, etime: 2 }, syllabicFr)
    expect(words[0].stime).toBe(5)
    expect(words[0].etime).toBe(5)
  })
})
