// getSyllabic eagerly loads syllabicEN, which pulls the ESM-only `syllable`
// package Jest can't transform. These tests run on the fr-FR path
// (self-contained syllabicFR), so the EN dependency is stubbed.
jest.mock("syllable", () => ({ syllable: () => 1 }))

const { computeRetimedTurn } = require(
  `${process.cwd()}/components/EditorHandler/utils/computeRetimedTurn`,
)

const OLD_TURN = {
  turn_id: "turn-1",
  language: "fr-FR",
  stime: 0,
  etime: 4,
  words: [
    { wid: "w-1", word: "Bonjour", stime: 0, etime: 0.8, confidence: 0.9 },
    { wid: "w-2", word: "tout", stime: 0.9, etime: 1.1 },
    { wid: "w-3", word: "le", stime: 1.2, etime: 1.3 },
    { wid: "w-4", word: "monde", stime: 1.4, etime: 1.8 },
  ],
}

describe("computeRetimedTurn", () => {
  test("unchanged text keeps every timing, wid and confidence verbatim", () => {
    const result = computeRetimedTurn(OLD_TURN, "Bonjour tout le monde")
    expect(result.segment).toBe("Bonjour tout le monde")
    expect(result.words).toEqual(OLD_TURN.words)
    expect(result.stime).toBe(0)
    expect(result.etime).toBe(1.8)
  })

  test("an edited word is interpolated between its intact neighbours, with a fresh wid", () => {
    const result = computeRetimedTurn(OLD_TURN, "Bonjour tous le monde")
    const [bonjour, tous, le, monde] = result.words

    expect(bonjour).toEqual(OLD_TURN.words[0])
    expect(le).toEqual(OLD_TURN.words[2])
    expect(monde).toEqual(OLD_TURN.words[3])

    expect(tous.word).toBe("tous")
    expect(tous.wid).toBeDefined()
    expect(tous.wid).not.toBe("w-2")
    // Interpolated inside the [previous anchor's etime, next anchor's stime] window.
    expect(tous.stime).toBeGreaterThanOrEqual(0.8)
    expect(tous.etime).toBeLessThanOrEqual(1.2)
  })

  test("inserted words share the anchor window by syllables", () => {
    const result = computeRetimedTurn(
      OLD_TURN,
      "Bonjour vraiment tout le monde",
    )
    expect(result.words.map((w) => w.word)).toEqual([
      "Bonjour",
      "vraiment",
      "tout",
      "le",
      "monde",
    ])
    const vraiment = result.words[1]
    expect(vraiment.stime).toBeGreaterThanOrEqual(0.8)
    expect(vraiment.etime).toBeLessThanOrEqual(0.9)
    // The anchors around it are untouched.
    expect(result.words[2]).toEqual(OLD_TURN.words[1])
  })

  test("never writes undefined fields (Mongo would persist them as null)", () => {
    const result = computeRetimedTurn(
      { turn_id: "t", language: "fr", stime: 0, etime: 2, words: [] },
      "texte neuf",
    )
    for (const word of result.words) {
      expect(Object.values(word).every((v) => v !== undefined)).toBe(true)
      expect(word.wid).toBeDefined()
    }
  })

  test("an emptied turn keeps the old turn-level times and no words", () => {
    const result = computeRetimedTurn(OLD_TURN, "")
    expect(result.words).toEqual([])
    expect(result.segment).toBe("")
    expect(result.stime).toBe(0)
    expect(result.etime).toBe(4)
  })

  test("turn-level times follow the retimed words", () => {
    const result = computeRetimedTurn(OLD_TURN, "salut tout le monde")
    expect(result.stime).toBe(result.words[0].stime)
    expect(result.etime).toBe(1.8)
  })
})

describe("computeRetimedTurn — no timing basis", () => {
  test("a turn with no timed word and no turn-level times stays untimed", () => {
    const result = computeRetimedTurn(
      { turn_id: "t", language: "fr", words: [] },
      "du texte sans aucun temps",
    )
    expect(result.words).toHaveLength(5)
    for (const word of result.words) {
      expect("stime" in word).toBe(false)
      expect("etime" in word).toBe(false)
      expect(word.wid).toBeDefined()
    }
    expect("stime" in result).toBe(false)
    expect("etime" in result).toBe(false)
  })

  test("turn-level times alone are enough of a basis (linear spread)", () => {
    const result = computeRetimedTurn(
      { turn_id: "t", language: "fr", stime: 10, etime: 12, words: [] },
      "deux mots",
    )
    expect(result.words[0].stime).toBe(10)
    expect(result.words[1].etime).toBe(12)
  })
})
