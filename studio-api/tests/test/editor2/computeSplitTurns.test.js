const { computeSplitTurns } = require(
  `${process.cwd()}/components/EditorHandler2/utils/computeSplitTurns`,
)

// Derived text: "Bonjour tout le monde" — offsets: Bonjour[0,7] tout[8,12]
// le[13,15] monde[16,21]
const TURN = {
  turn_id: "turn-1",
  speaker_id: "spk-1",
  segment: "Bonjour tout le monde",
  raw_segment: "Bonjour tout le monde (asr)",
  language: "fr",
  lang: "fr-FR",
  stime: 0,
  etime: 2,
  words: [
    { wid: "w-1", word: "Bonjour", stime: 0, etime: 0.8 },
    { wid: "w-2", word: "tout", stime: 0.9, etime: 1.1 },
    { wid: "w-3", word: "le", stime: 1.2, etime: 1.3 },
    { wid: "w-4", word: "monde", stime: 1.4, etime: 1.8, confidence: 0.7 },
  ],
}

describe("computeSplitTurns", () => {
  test("splits cleanly in an inter-word gap", () => {
    // Offset 12 = right after "tout" (the gap before "le").
    const { left, right } = computeSplitTurns(TURN, 12)

    expect(left.turn_id).toBe("turn-1")
    expect(left.segment).toBe("Bonjour tout")
    expect(left.words.map((w) => w.wid)).toEqual(["w-1", "w-2"])
    expect(left.stime).toBe(0)
    expect(left.etime).toBe(1.1)

    expect(right.turn_id).not.toBe("turn-1")
    expect(right.segment).toBe("le monde")
    expect(right.words.map((w) => w.wid)).toEqual(["w-3", "w-4"])
    expect(right.words[1].confidence).toBe(0.7)
    expect(right.stime).toBe(1.2)
    expect(right.etime).toBe(1.8)
  })

  test("cuts a straddled word proportionally: left keeps the wid, right is minted", () => {
    // Offset 10 = inside "tout" (t-o | u-t), ratio 2/4 over [0.9, 1.1] → 1.0
    const { left, right } = computeSplitTurns(TURN, 10)

    const leftCut = left.words[left.words.length - 1]
    expect(leftCut).toMatchObject({
      wid: "w-2",
      word: "to",
      stime: 0.9,
      etime: 1,
    })

    const rightCut = right.words[0]
    expect(rightCut.word).toBe("ut")
    expect(rightCut.wid).toBeDefined()
    expect(rightCut.wid).not.toBe("w-2")
    expect(rightCut).toMatchObject({ stime: 1, etime: 1.1 })
  })

  test("a wordless turn splits its own span proportionally", () => {
    const turn = {
      turn_id: "turn-2",
      segment: "texte brut sans mots",
      words: [],
      stime: 10,
      etime: 20,
    }
    // "texte brut sans mots" length 20, offset 10 → cut at 15.
    const { left, right } = computeSplitTurns(turn, 10)
    expect(left.segment).toBe("texte brut")
    expect(right.segment).toBe("sans mots")
    expect(left.stime).toBe(10)
    expect(left.etime).toBe(15)
    expect(right.stime).toBe(15)
    expect(right.etime).toBe(20)
  })

  test("preserves foreign fields in BOTH halves and overrides raw_segment", () => {
    const { left, right } = computeSplitTurns(TURN, 12)
    expect(left.lang).toBe("fr-FR")
    expect(right.lang).toBe("fr-FR")
    expect(right.speaker_id).toBe("spk-1")
    expect(left.raw_segment).toBe("Bonjour tout")
    expect(right.raw_segment).toBe("le monde")
  })

  test("refuses offsets that would produce an empty half", () => {
    expect(computeSplitTurns(TURN, 0)).toBeNull()
    expect(computeSplitTurns(TURN, 21)).toBeNull()
    expect(computeSplitTurns(TURN, -3)).toBeNull()
    expect(computeSplitTurns(TURN, 3.5)).toBeNull()
    expect(
      computeSplitTurns({ turn_id: "t", segment: "", words: [] }, 1),
    ).toBeNull()
  })

  test("splits on the derived layout even when Mongo words carry odd whitespace", () => {
    const turn = {
      turn_id: "turn-3",
      segment: "whatever",
      words: [
        { wid: "w-a", word: "l'enfant ?", stime: 0, etime: 1 },
        { wid: "w-b", word: "oui", stime: 2, etime: 3 },
      ],
    }
    // Derived text: "l'enfant ? oui" — offset 10 = the gap before "oui".
    const { left, right } = computeSplitTurns(turn, 10)
    expect(left.segment).toBe("l'enfant ?")
    expect(left.words.map((w) => w.word)).toEqual(["l'enfant", "?"])
    expect(right.segment).toBe("oui")
    expect(right.words[0].wid).toBe("w-b")
  })

  test("never writes undefined fields on the produced words", () => {
    const turn = {
      turn_id: "turn-4",
      segment: "un deux",
      words: [
        { wid: "w-1", word: "un" },
        { wid: "w-2", word: "deux" },
      ],
    }
    const { left, right } = computeSplitTurns(turn, 2)
    for (const w of [...left.words, ...right.words]) {
      expect(Object.values(w).every((v) => v !== undefined)).toBe(true)
    }
    expect(left.stime).toBeUndefined()
    expect("stime" in left ? left.stime !== undefined : true).toBe(true)
  })
})
