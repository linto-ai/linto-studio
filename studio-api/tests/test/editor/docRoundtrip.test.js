// Round-trip: Mongo turns -> Y.Doc (seed) -> turns (flush extract).
// Plain-text schema: turns carry text only. Words and timestamps are NOT in
// the doc (owned by WordsState, aligned by tokenization), so the extracted
// turns have no `words` field.
const Y = require("yjs")
const {
  seedYDoc,
} = require(`${process.cwd()}/components/EditorHandler/schema/seedYDoc`)
const {
  docToTurns,
} = require(`${process.cwd()}/components/EditorHandler/schema/docToTurns`)
const {
  tokenize,
} = require(`${process.cwd()}/components/EditorHandler2/utils/tokenize`)

describe("doc <-> turns round-trip (plain text)", () => {
  test("text and attrs survive; no words and no timestamps in the doc", () => {
    const turns = [
      {
        turn_id: "t1",
        speaker_id: "spk",
        language: "fr-FR",
        words: [
          { word: "bonjour", stime: 0, etime: 1, confidence: 1 },
          { word: "le", stime: 1, etime: 1.5, confidence: 1 },
          { word: "monde", stime: 1.5, etime: 2, confidence: 1 },
        ],
      },
    ]

    const ydoc = new Y.Doc()
    seedYDoc(ydoc, turns)
    const out = docToTurns(ydoc)

    expect(out).toHaveLength(1)
    expect(out[0].turn_id).toBe("t1")
    expect(out[0].speaker_id).toBe("spk")
    expect(out[0].language).toBe("fr-FR")
    expect(out[0].segment).toBe("bonjour le monde")
    expect(out[0].raw_segment).toBe("bonjour le monde")
    // Words are owned by WordsState; the doc extract carries none.
    expect(out[0].words).toBeUndefined()
  })

  test("a word with an internal space stays intact in the segment", () => {
    const turns = [
      {
        turn_id: "t1",
        speaker_id: "spk",
        language: "fr-FR",
        words: [
          { word: "l'enfant ?", stime: 0, etime: 1 },
          { word: "oui", stime: 1, etime: 2 },
        ],
      },
    ]
    const ydoc = new Y.Doc()
    seedYDoc(ydoc, turns)
    const out = docToTurns(ydoc)

    expect(out[0].segment).toBe("l'enfant ? oui")
  })

  test("whitespace is normalized at seed: no leading/trailing space, no runs", () => {
    const turns = [
      {
        turn_id: "t1",
        speaker_id: "spk",
        language: "fr-FR",
        words: [
          { word: " bonjour ", stime: 0, etime: 1 },
          { word: "le monde", stime: 1, etime: 2 },
          { word: "  entier", stime: 2, etime: 3 },
        ],
      },
    ]
    const ydoc = new Y.Doc()
    seedYDoc(ydoc, turns)
    const out = docToTurns(ydoc)

    expect(out[0].segment).toBe("bonjour le monde entier")
    // The tokenization contract sees exactly the spoken tokens.
    expect(tokenize(out[0].segment).map((t) => t.text)).toEqual([
      "bonjour",
      "le",
      "monde",
      "entier",
    ])
  })

  test("whitespace-only words are dropped as timestamp placeholders", () => {
    const turns = [
      {
        turn_id: "t1",
        speaker_id: "spk",
        language: "fr-FR",
        words: [
          { word: "bonjour", stime: 0, etime: 1 },
          { word: "  ", stime: 1, etime: 2 },
          { word: "monde", stime: 2, etime: 3 },
        ],
      },
    ]
    const ydoc = new Y.Doc()
    seedYDoc(ydoc, turns)
    const out = docToTurns(ydoc)

    expect(out[0].segment).toBe("bonjour monde")
  })

  test("turn-level times survive the round-trip when words have no timing", () => {
    const turns = [
      {
        turn_id: "t1",
        speaker_id: "spk",
        language: "fr-FR",
        words: [{ word: "bonjour" }, { word: "monde" }],
        stime: 3,
        etime: 7,
      },
    ]
    const ydoc = new Y.Doc()
    seedYDoc(ydoc, turns)
    const out = docToTurns(ydoc)

    expect(out[0].stime).toBe(3)
    expect(out[0].etime).toBe(7)
    expect(out[0].segment).toBe("bonjour monde")
  })

  test("segment-only turn (no words[]) seeds normalized plain text", () => {
    const turns = [
      {
        turn_id: "t1",
        speaker_id: "spk",
        language: "fr-FR",
        segment: "  texte   sans\tmots ",
        words: [],
        stime: 0,
        etime: 2,
      },
    ]
    const ydoc = new Y.Doc()
    seedYDoc(ydoc, turns)
    const out = docToTurns(ydoc)

    expect(out[0].segment).toBe("texte sans mots")
    expect(out[0].stime).toBe(0)
    expect(out[0].etime).toBe(2)
  })
})
