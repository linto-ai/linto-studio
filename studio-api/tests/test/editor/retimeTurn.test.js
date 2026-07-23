const {
  retimeTurn,
} = require(`${process.cwd()}/components/EditorHandler2/utils/retimeTurn`)
const {
  tokenize,
} = require(`${process.cwd()}/components/EditorHandler2/utils/tokenize`)
const SyllabicFR = require(`${process.cwd()}/components/EditorHandler2/utils/syllabic/syllabicFR`)

const syllabicFr = new SyllabicFR("fr-FR")

/** Build carried entries from a spec of [text, stime, etime] laid out over a
 *  text, computing offsets by walking the text (single-space layout). */
function carriedFrom(text, spec) {
  let cursor = 0
  return spec.map(([word, stime, etime]) => {
    const charStart = text.indexOf(word, cursor)
    const charEnd = charStart + word.length
    cursor = charEnd
    return { text: word, charStart, charEnd, stime, etime }
  })
}

function retime(text, carried, bounds) {
  return retimeTurn(tokenize(text), carried, bounds, syllabicFr)
}

describe("retimeTurn", () => {
  test("untouched turn: every timing kept verbatim", () => {
    const text = "bonjour tout le monde"
    const carried = carriedFrom(text, [
      ["bonjour", 0, 0.8],
      ["tout", 0.9, 1.1],
      ["le", 1.1, 1.2],
      ["monde", 1.2, 1.7],
    ])
    expect(retime(text, carried)).toEqual([
      { word: "bonjour", stime: 0, etime: 0.8 },
      { word: "tout", stime: 0.9, etime: 1.1 },
      { word: "le", stime: 1.1, etime: 1.2 },
      { word: "monde", stime: 1.2, etime: 1.7 },
    ])
  })

  test("respelled: a typo fix keeps the word's moment", () => {
    // "monde" was retyped as "mondes" in place — the hot path stretched the
    // entry's range with the insertion.
    const text = "le mondes"
    const carried = [
      { text: "le", charStart: 0, charEnd: 2, stime: 1.1, etime: 1.2 },
      { text: "monde", charStart: 3, charEnd: 9, stime: 1.2, etime: 1.7 },
    ]
    expect(retime(text, carried)).toEqual([
      { word: "le", stime: 1.1, etime: 1.2 },
      { word: "mondes", stime: 1.2, etime: 1.7 },
    ])
  })

  test("merged: deleting the space glues two words, span covers both", () => {
    // "tout le" became "toutle": entries shifted, now both under one token.
    const text = "toutle monde"
    const carried = [
      { text: "tout", charStart: 0, charEnd: 4, stime: 0.9, etime: 1.1 },
      { text: "le", charStart: 4, charEnd: 6, stime: 1.1, etime: 1.2 },
      { text: "monde", charStart: 7, charEnd: 12, stime: 1.2, etime: 1.7 },
    ]
    expect(retime(text, carried)).toEqual([
      { word: "toutle", stime: 0.9, etime: 1.2 },
      { word: "monde", stime: 1.2, etime: 1.7 },
    ])
  })

  test("reshaped: splitting a word redistributes its span by syllables", () => {
    // "bonjour" [0.75, 1.35] split into "bon jour": one entry claimed by two
    // tokens → both flex over the old span (1 syllable each → half/half).
    const text = "bon jour"
    const carried = [
      { text: "bonjour", charStart: 0, charEnd: 8, stime: 0.75, etime: 1.35 },
    ]
    expect(retime(text, carried)).toEqual([
      { word: "bon", stime: 0.75, etime: 1.05 },
      { word: "jour", stime: 1.05, etime: 1.35 },
    ])
  })

  test("typed: new words interpolate between kept neighbours", () => {
    // " vraiment très" typed between "bonjour" and "cher": the gap
    // [0.8, 2.0] is shared by syllables (vrai/ment=2, très=1).
    const text = "bonjour vraiment très cher"
    const carried = [
      { text: "bonjour", charStart: 0, charEnd: 7, stime: 0, etime: 0.8 },
      { text: "cher", charStart: 22, charEnd: 26, stime: 2.0, etime: 2.4 },
    ]
    expect(retime(text, carried)).toEqual([
      { word: "bonjour", stime: 0, etime: 0.8 },
      { word: "vraiment", stime: 0.8, etime: 1.6 },
      { word: "très", stime: 1.6, etime: 2.0 },
      { word: "cher", stime: 2.0, etime: 2.4 },
    ])
  })

  test("deleted words vanish, neighbours untouched", () => {
    // "tout le" deleted: their entries are gone from carried (hot path did
    // it), remaining words keep their timing.
    const text = "bonjour monde"
    const carried = [
      { text: "bonjour", charStart: 0, charEnd: 7, stime: 0, etime: 0.8 },
      { text: "monde", charStart: 8, charEnd: 13, stime: 1.2, etime: 1.7 },
    ]
    expect(retime(text, carried)).toEqual([
      { word: "bonjour", stime: 0, etime: 0.8 },
      { word: "monde", stime: 1.2, etime: 1.7 },
    ])
  })

  test("blurred boundary falls back to a budgeted flex window", () => {
    // "ab cd" reworked into "abc d": cd's entry is claimed by both tokens
    // (abc overlaps ab+cd, d overlaps cd) → whole window re-timed over the
    // union budget [0, 1.0], anchored nowhere else.
    const text = "abc d"
    const carried = [
      { text: "ab", charStart: 0, charEnd: 2, stime: 0, etime: 0.4 },
      { text: "cd", charStart: 2, charEnd: 5, stime: 0.4, etime: 1.0 },
    ]
    const result = retime(text, carried)
    expect(result.map((w) => w.word)).toEqual(["abc", "d"])
    expect(result[0].stime).toBe(0)
    expect(result[1].etime).toBe(1.0)
    expect(result[0].etime).toBe(result[1].stime)
  })

  test("fresh turn with no history interpolates over turn bounds", () => {
    const text = "un mot"
    const result = retime(text, [], { stime: 10, etime: 11 })
    expect(result[0].stime).toBe(10)
    expect(result[1].etime).toBe(11)
  })

  test("empty text yields no words", () => {
    expect(retime("", [])).toEqual([])
  })
})

describe("tokenize", () => {
  test("splits on any whitespace run, offsets in code units", () => {
    expect(tokenize("  bonjour\t tout  le\nmonde ")).toEqual([
      { text: "bonjour", charStart: 2, charEnd: 9 },
      { text: "tout", charStart: 11, charEnd: 15 },
      { text: "le", charStart: 17, charEnd: 19 },
      { text: "monde", charStart: 20, charEnd: 25 },
    ])
  })

  test("empty and whitespace-only texts yield no tokens", () => {
    expect(tokenize("")).toEqual([])
    expect(tokenize("   ")).toEqual([])
  })
})
