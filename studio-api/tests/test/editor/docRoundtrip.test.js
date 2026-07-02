// Round-trip: Mongo turns -> Y.Doc (seed) -> Mongo turns (flush extract).
// Verifies word identity (wid) survives the CRDT through the `word` mark, and
// that timestamps are intentionally NOT carried in the doc.
const Y = require("yjs")
const {
  seedYDoc,
} = require(`${process.cwd()}/components/EditorHandler/schema/seedYDoc`)
const {
  docToTurns,
} = require(`${process.cwd()}/components/EditorHandler/schema/docToTurns`)

describe("doc <-> turns round-trip (wid marks)", () => {
  test("wids and text survive; timestamps stay out of the doc", () => {
    const turns = [
      {
        turn_id: "t1",
        speaker_id: "spk",
        language: "fr-FR",
        words: [
          { wid: "w1", word: "bonjour", stime: 0, etime: 1, confidence: 1 },
          { wid: "w2", word: "le", stime: 1, etime: 1.5, confidence: 1 },
          { wid: "w3", word: "monde", stime: 1.5, etime: 2, confidence: 1 },
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
    // Identity only, no timestamps in the doc.
    expect(out[0].words).toEqual([
      { wid: "w1", word: "bonjour" },
      { wid: "w2", word: "le" },
      { wid: "w3", word: "monde" },
    ])
  })

  test("a multi-space word stays a single word/wid", () => {
    const turns = [
      {
        turn_id: "t1",
        speaker_id: "spk",
        language: "fr-FR",
        words: [
          { wid: "w1", word: "l'enfant ?", stime: 0, etime: 1 },
          { wid: "w2", word: "oui", stime: 1, etime: 2 },
        ],
      },
    ]
    const ydoc = new Y.Doc()
    seedYDoc(ydoc, turns)
    const out = docToTurns(ydoc)

    expect(out[0].words).toEqual([
      { wid: "w1", word: "l'enfant ?" },
      { wid: "w2", word: "oui" },
    ])
    expect(out[0].segment).toBe("l'enfant ? oui")
  })

  test("legacy word without wid gets one minted at seed", () => {
    const turns = [
      {
        turn_id: "t1",
        speaker_id: "spk",
        language: "fr-FR",
        words: [{ word: "salut", stime: 0, etime: 1 }],
      },
    ]
    const ydoc = new Y.Doc()
    seedYDoc(ydoc, turns)
    const out = docToTurns(ydoc)

    expect(out[0].words).toHaveLength(1)
    expect(out[0].words[0].word).toBe("salut")
    expect(typeof out[0].words[0].wid).toBe("string")
    expect(out[0].words[0].wid.length).toBeGreaterThan(0)
  })

  test("turn-level times survive the round-trip when words have no timing", () => {
    const turns = [
      {
        turn_id: "t1",
        speaker_id: "spk",
        language: "fr-FR",
        words: [{ wid: "w1", word: "bonjour" }, { wid: "w2", word: "monde" }],
        stime: 3,
        etime: 7,
      },
    ]
    const ydoc = new Y.Doc()
    seedYDoc(ydoc, turns)
    const out = docToTurns(ydoc)

    expect(out[0].stime).toBe(3)
    expect(out[0].etime).toBe(7)
    expect(out[0].words).toEqual([
      { wid: "w1", word: "bonjour" },
      { wid: "w2", word: "monde" },
    ])
  })

  test("legacy segment-only turn (no words[]) seeds plain text and yields words:[]", () => {
    const turns = [
      {
        turn_id: "t1",
        speaker_id: "spk",
        language: "fr-FR",
        segment: "texte sans mots",
        words: [],
        stime: 0,
        etime: 2,
      },
    ]
    const ydoc = new Y.Doc()
    seedYDoc(ydoc, turns)
    const out = docToTurns(ydoc)

    expect(out[0].segment).toBe("texte sans mots")
    expect(out[0].words).toEqual([])
    expect(out[0].stime).toBe(0)
    expect(out[0].etime).toBe(2)
  })
})
