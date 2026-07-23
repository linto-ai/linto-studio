// WordsState driven by a REAL Y.Doc: edits go through doc.transact and reach
// the state via fragment.observeDeep, exactly like the Hocuspocus runtime.
const Y = require("yjs")
const {
  WordsState,
} = require(`${process.cwd()}/components/EditorHandler/wordsState/wordsState`)
// Not words/syllabic/index.js: its EN variant imports the ESM-only `syllable`
// package, which Jest can't parse. The FR fallback is all these tests need.
const SyllabicFR = require(`${process.cwd()}/components/EditorHandler2/utils/syllabic/syllabicFR`)

const syllabicFr = new SyllabicFR("fr-FR")
const getSyllabic = () => syllabicFr

function makeTurn({ id, speakerId, text }) {
  const el = new Y.XmlElement("turn")
  if (id != null) el.setAttribute("id", id)
  if (speakerId != null) el.setAttribute("speakerId", speakerId)
  const t = new Y.XmlText()
  if (text) t.insert(0, text)
  el.insert(0, [t])
  return el
}

function setup(turnSpecs, mongoTurns) {
  const doc = new Y.Doc()
  const fragment = doc.getXmlFragment("default")
  doc.transact(() => {
    fragment.insert(0, turnSpecs.map(makeTurn))
  })
  const state = new WordsState(fragment)
  state.hydrate(mongoTurns)
  fragment.observeDeep((events) => state.applyEvents(events))
  return { doc, fragment, state }
}

function turnText(fragment, i) {
  return fragment.get(i).get(0)
}

function mongoWord(wid, word, stime, etime) {
  return { wid, word, stime, etime, confidence: 0.9 }
}

// "bonjour tout le monde": bonjour [0,7) tout [8,12) le [13,15) monde [16,21)
const BASE_WORDS = [
  mongoWord("w1", "bonjour", 0, 0.8),
  mongoWord("w2", "tout", 0.9, 1.1),
  mongoWord("w3", "le", 1.1, 1.2),
  mongoWord("w4", "monde", 1.2, 1.7),
]
const BASE_TURN = {
  turn_id: "t1",
  speaker_id: "spk1",
  segment: "bonjour tout le monde",
  language: "fr-FR",
  stime: 0,
  etime: 1.7,
  words: BASE_WORDS,
}

function baseSetup() {
  return setup(
    [{ id: "t1", speakerId: "spk1", text: BASE_TURN.segment }],
    [BASE_TURN],
  )
}

describe("WordsState", () => {
  test("hydrate + no edit: clean, serialize returns Mongo-equivalent turns", () => {
    const { state } = baseSetup()

    expect(state.hasDirty()).toBe(false)
    expect(state.serialize()).toEqual([
      {
        turn_id: "t1",
        speaker_id: "spk1",
        segment: "bonjour tout le monde",
        raw_segment: "bonjour tout le monde",
        language: "fr-FR",
        stime: 0,
        etime: 1.7,
        words: BASE_WORDS,
      },
    ])
  })

  test("serialize preserves Mongo fields it doesn't own (raw_segment history, lang, extras)", () => {
    // Regression: the flush replaces whole turn documents — any hydrated
    // field dropped by serialize() is DELETED from Mongo permanently
    // (raw_segment feeds text search and the REST turn merge; lang feeds
    // exports).
    const { doc, fragment, state } = setup(
      [{ id: "t1", speakerId: "spk1", text: "bonjour tout le monde" }],
      [{ ...BASE_TURN, raw_segment: "asr raw text", lang: "en-US", extra: 42 }],
    )

    doc.transact(() => {
      turnText(fragment, 0).insert(7, "x") // "bonjourx tout le monde"
    })
    state.retimeDirty(() => syllabicFr)

    const [turn] = state.serialize()
    expect(turn.lang).toBe("en-US")
    expect(turn.extra).toBe(42)
    // raw_segment follows the edited text (same rule as the old enrichDiff).
    expect(turn.raw_segment).toBe("bonjourx tout le monde")
    expect(turn.segment).toBe("bonjourx tout le monde")
  })

  test("typing inside a word: neighbours verbatim, word keeps its span and wid", () => {
    const { state, fragment } = baseSetup()

    turnText(fragment, 0).insert(18, "x") // mo|nde -> moxnde

    expect(state.hasDirty()).toBe(true)
    expect(state.retimeDirty(getSyllabic)).toEqual([
      {
        turn_id: "t1",
        words: [
          { wid: "w1", word: "bonjour", stime: 0, etime: 0.8, confidence: 0.9 },
          { wid: "w2", word: "tout", stime: 0.9, etime: 1.1, confidence: 0.9 },
          { wid: "w3", word: "le", stime: 1.1, etime: 1.2, confidence: 0.9 },
          { wid: "w4", word: "moxnde", stime: 1.2, etime: 1.7, confidence: 0.9 },
        ],
      },
    ])
    expect(state.hasDirty()).toBe(false)
  })

  test("typing a new word between words: interpolated, fresh wid", () => {
    const { state, fragment } = setup(
      [{ id: "t1", speakerId: "spk1", text: "bonjour cher" }],
      [
        {
          turn_id: "t1",
          speaker_id: "spk1",
          segment: "bonjour cher",
          language: "fr-FR",
          stime: 0,
          etime: 2.4,
          words: [
            mongoWord("w1", "bonjour", 0, 0.8),
            mongoWord("w2", "cher", 2.0, 2.4),
          ],
        },
      ],
    )

    turnText(fragment, 0).insert(7, " vraiment très")

    const [changed] = state.retimeDirty(getSyllabic)
    expect(changed.words).toEqual([
      { wid: "w1", word: "bonjour", stime: 0, etime: 0.8, confidence: 0.9 },
      { wid: expect.any(String), word: "vraiment", stime: 0.8, etime: 1.6 },
      { wid: expect.any(String), word: "très", stime: 1.6, etime: 2.0 },
      { wid: "w2", word: "cher", stime: 2.0, etime: 2.4, confidence: 0.9 },
    ])
    // Typed words got fresh distinct wids.
    expect(changed.words[1].wid).not.toBe(changed.words[2].wid)
    expect(["w1", "w2"]).not.toContain(changed.words[1].wid)
  })

  test("deleting a word: gone, neighbours untouched", () => {
    const { state, fragment } = baseSetup()

    turnText(fragment, 0).delete(8, 5) // "tout "

    expect(state.retimeDirty(getSyllabic)).toEqual([
      {
        turn_id: "t1",
        words: [
          { wid: "w1", word: "bonjour", stime: 0, etime: 0.8, confidence: 0.9 },
          { wid: "w3", word: "le", stime: 1.1, etime: 1.2, confidence: 0.9 },
          { wid: "w4", word: "monde", stime: 1.2, etime: 1.7, confidence: 0.9 },
        ],
      },
    ])
    expect(state.serialize()[0].segment).toBe("bonjour le monde")
  })

  test("deleting the space between two words: merged span, fresh wid", () => {
    const { state, fragment } = baseSetup()

    turnText(fragment, 0).delete(12, 1) // "tout| |le" -> "toutle"

    const [changed] = state.retimeDirty(getSyllabic)
    expect(changed.words).toEqual([
      { wid: "w1", word: "bonjour", stime: 0, etime: 0.8, confidence: 0.9 },
      { wid: expect.any(String), word: "toutle", stime: 0.9, etime: 1.2 },
      { wid: "w4", word: "monde", stime: 1.2, etime: 1.7, confidence: 0.9 },
    ])
    expect(["w2", "w3"]).not.toContain(changed.words[1].wid)
  })

  test("inserting a space inside a word: syllabic redistribution of its span", () => {
    const { state, fragment } = setup(
      [{ id: "t1", speakerId: "spk1", text: "bonjour monde" }],
      [
        {
          turn_id: "t1",
          speaker_id: "spk1",
          segment: "bonjour monde",
          language: "fr-FR",
          stime: 0.75,
          etime: 2.0,
          words: [
            mongoWord("w1", "bonjour", 0.75, 1.35),
            mongoWord("w2", "monde", 1.5, 2.0),
          ],
        },
      ],
    )

    turnText(fragment, 0).insert(3, " ") // bon|jour

    // The flex zone is anchored by the NEXT kept word: it runs from the old
    // "bonjour" start (0.75) to "monde"'s stime (1.5), split half/half by
    // syllables (interpolate.js prefers anchors over the old-span budget).
    const [changed] = state.retimeDirty(getSyllabic)
    expect(changed.words).toEqual([
      { wid: expect.any(String), word: "bon", stime: 0.75, etime: 1.13 },
      { wid: expect.any(String), word: "jour", stime: 1.13, etime: 1.5 },
      { wid: "w2", word: "monde", stime: 1.5, etime: 2.0, confidence: 0.9 },
    ])
  })

  test("turn split in one transaction: moved words keep their timings", () => {
    const { state, doc, fragment } = baseSetup()

    // The y-prosemirror shape of a split: the tail leaves turn A's text and a
    // new turn element (no server-assigned id yet) appears with exactly it.
    doc.transact(() => {
      turnText(fragment, 0).delete(12, 9) // " le monde"
      fragment.insert(1, [makeTurn({ speakerId: "spk1", text: "le monde" })])
    })

    expect(state.retimeDirty(getSyllabic)).toEqual([
      {
        turn_id: "t1",
        words: [
          { wid: "w1", word: "bonjour", stime: 0, etime: 0.8, confidence: 0.9 },
          { wid: "w2", word: "tout", stime: 0.9, etime: 1.1, confidence: 0.9 },
        ],
      },
      {
        turn_id: null,
        words: [
          { wid: "w3", word: "le", stime: 1.1, etime: 1.2, confidence: 0.9 },
          { wid: "w4", word: "monde", stime: 1.2, etime: 1.7, confidence: 0.9 },
        ],
      },
    ])

    expect(state.serialize()).toEqual([
      {
        turn_id: "t1",
        speaker_id: "spk1",
        segment: "bonjour tout",
        raw_segment: "bonjour tout",
        language: "fr-FR",
        stime: 0,
        etime: 1.1,
        words: [
          { wid: "w1", word: "bonjour", stime: 0, etime: 0.8, confidence: 0.9 },
          { wid: "w2", word: "tout", stime: 0.9, etime: 1.1, confidence: 0.9 },
        ],
      },
      {
        turn_id: null,
        speaker_id: "spk1",
        segment: "le monde",
        raw_segment: "le monde",
        // No language attribute on the hand-built split element and no Mongo
        // history: falls back to the syllabic default.
        language: "fr",
        stime: 1.1,
        etime: 1.7,
        words: [
          { wid: "w3", word: "le", stime: 1.1, etime: 1.2, confidence: 0.9 },
          { wid: "w4", word: "monde", stime: 1.2, etime: 1.7, confidence: 0.9 },
        ],
      },
    ])
  })

  test("turn merge in one transaction: absorbed words keep their timings", () => {
    const { state, doc, fragment } = setup(
      [
        { id: "t1", speakerId: "spk1", text: "bonjour tout" },
        { id: "t2", speakerId: "spk2", text: "le monde" },
      ],
      [
        {
          turn_id: "t1",
          speaker_id: "spk1",
          segment: "bonjour tout",
          language: "fr-FR",
          stime: 0,
          etime: 1.1,
          words: [
            mongoWord("w1", "bonjour", 0, 0.8),
            mongoWord("w2", "tout", 0.9, 1.1),
          ],
        },
        {
          turn_id: "t2",
          speaker_id: "spk2",
          segment: "le monde",
          language: "fr-FR",
          stime: 1.1,
          etime: 1.7,
          words: [
            mongoWord("w3", "le", 1.1, 1.2),
            mongoWord("w4", "monde", 1.2, 1.7),
          ],
        },
      ],
    )

    doc.transact(() => {
      turnText(fragment, 0).insert(12, " le monde")
      fragment.delete(1, 1)
    })

    expect(state.retimeDirty(getSyllabic)).toEqual([
      {
        turn_id: "t1",
        words: [
          { wid: "w1", word: "bonjour", stime: 0, etime: 0.8, confidence: 0.9 },
          { wid: "w2", word: "tout", stime: 0.9, etime: 1.1, confidence: 0.9 },
          { wid: "w3", word: "le", stime: 1.1, etime: 1.2, confidence: 0.9 },
          { wid: "w4", word: "monde", stime: 1.2, etime: 1.7, confidence: 0.9 },
        ],
      },
    ])

    const turns = state.serialize()
    expect(turns).toHaveLength(1)
    expect(turns[0].segment).toBe("bonjour tout le monde")
    expect(turns[0].etime).toBe(1.7)
  })

  test("self-healing: corrupt mirror is detected, warned about and realigned", () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {})
    try {
      const { state, fragment } = baseSetup()

      // Poke the internals: the mirror no longer matches the doc.
      state.turnMirrors.get(fragment.get(0)).text = "corrompu"

      turnText(fragment, 0).insert(21, "x") // any edit triggers the self-check

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn.mock.calls[0][0]).toMatch(/mirror out of sync/)

      // Realigned: known words recovered their timing, the edited word is
      // interpolated, serialize stays coherent with the actual doc text.
      const [changed] = state.retimeDirty(getSyllabic)
      expect(changed.words).toEqual([
        { wid: "w1", word: "bonjour", stime: 0, etime: 0.8, confidence: 0.9 },
        { wid: "w2", word: "tout", stime: 0.9, etime: 1.1, confidence: 0.9 },
        { wid: "w3", word: "le", stime: 1.1, etime: 1.2, confidence: 0.9 },
        { wid: expect.any(String), word: "mondex", stime: 1.2, etime: 1.7 },
      ])
      expect(state.serialize()[0].segment).toBe("bonjour tout le mondex")
    } finally {
      warn.mockRestore()
    }
  })

  test("hydrate marks partially unmatched turns dirty and retime completes them", () => {
    // The doc text is AHEAD of Mongo (invariant state >= text): one word was
    // already edited before the state existed.
    const { state } = setup(
      [{ id: "t1", speakerId: "spk1", text: "bonjour tout le mondes" }],
      [BASE_TURN],
    )

    expect(state.hasDirty()).toBe(true)
    const [changed] = state.retimeDirty(getSyllabic)
    expect(changed.words.map((w) => w.word)).toEqual([
      "bonjour",
      "tout",
      "le",
      "mondes",
    ])
    // Unmatched token: interpolated between its neighbour and the turn end.
    expect(changed.words[3].stime).toBe(1.2)
    expect(changed.words[3].etime).toBe(1.7)
  })

  test("a turn element with no Mongo counterpart starts empty and dirty", () => {
    const { state } = setup(
      [
        { id: "t1", speakerId: "spk1", text: "bonjour tout le monde" },
        { id: "t9", speakerId: "spk1", text: "un mot" },
      ],
      [BASE_TURN],
    )

    expect(state.hasDirty()).toBe(true)
    const changed = state.retimeDirty(getSyllabic)
    expect(changed).toHaveLength(1)
    expect(changed[0].turn_id).toBe("t9")
    expect(changed[0].words.map((w) => w.word)).toEqual(["un", "mot"])
  })
})
