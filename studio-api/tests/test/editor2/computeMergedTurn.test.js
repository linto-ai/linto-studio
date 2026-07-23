const { computeMergedTurn } = require(
  `${process.cwd()}/components/EditorHandler2/utils/computeMergedTurn`,
)

const SHORT = {
  turn_id: "turn-a",
  speaker_id: "spk-a",
  language: "fr",
  lang: "fr-FR",
  segment: "Oui",
  stime: 0,
  etime: 0.5,
  words: [{ wid: "w-a1", word: "Oui", stime: 0, etime: 0.5 }],
}

const LONG = {
  turn_id: "turn-b",
  speaker_id: "spk-b",
  language: "en",
  lang: "en-US",
  segment: "une phrase nettement plus longue",
  stime: 1,
  etime: 3,
  words: [
    { wid: "w-b1", word: "une", stime: 1, etime: 1.2 },
    { wid: "w-b2", word: "phrase", stime: 1.2, etime: 1.6 },
    { wid: "w-b3", word: "nettement", stime: 1.6, etime: 2.2 },
    { wid: "w-b4", word: "plus", stime: 2.2, etime: 2.5 },
    { wid: "w-b5", word: "longue", stime: 2.5, etime: 3 },
  ],
}

describe("computeMergedTurn", () => {
  test("concatenates texts and words verbatim, in document order", () => {
    const merged = computeMergedTurn(SHORT, LONG)
    expect(merged.segment).toBe("Oui une phrase nettement plus longue")
    expect(merged.raw_segment).toBe(merged.segment)
    expect(merged.words.map((w) => w.wid)).toEqual([
      "w-a1",
      "w-b1",
      "w-b2",
      "w-b3",
      "w-b4",
      "w-b5",
    ])
    expect(merged.stime).toBe(0)
    expect(merged.etime).toBe(3)
  })

  test("the LARGER turn provides every attribute (id, speaker, language, foreign fields)", () => {
    const merged = computeMergedTurn(SHORT, LONG)
    expect(merged.turn_id).toBe("turn-b")
    expect(merged.speaker_id).toBe("spk-b")
    expect(merged.language).toBe("en")
    expect(merged.lang).toBe("en-US")

    const reversed = computeMergedTurn(LONG, SHORT)
    expect(reversed.turn_id).toBe("turn-b")
    expect(reversed.speaker_id).toBe("spk-b")
    // Document order still rules the content.
    expect(reversed.segment).toBe("une phrase nettement plus longue Oui")
  })

  test("ties go to the first turn", () => {
    const a = { ...SHORT, turn_id: "t-1", segment: "abc", words: [] }
    const b = { ...SHORT, turn_id: "t-2", speaker_id: "spk-x", segment: "xyz", words: [] }
    const merged = computeMergedTurn(a, b)
    expect(merged.turn_id).toBe("t-1")
    expect(merged.speaker_id).toBe("spk-a")
  })

  test("wordless turns merge on their segments and turn-level bounds", () => {
    const a = { turn_id: "t-1", segment: "  du  texte ", words: [], stime: 5, etime: 6 }
    const b = { turn_id: "t-2", segment: "brut", words: [], stime: 6, etime: 7 }
    const merged = computeMergedTurn(a, b)
    expect(merged.segment).toBe("du texte brut")
    expect(merged.stime).toBe(5)
    expect(merged.etime).toBe(7)
  })
})
