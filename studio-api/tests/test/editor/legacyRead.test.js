// Migration read path: a generation-1 (mark-based) Y.Doc is decoded with the
// legacy schema, and docToTurnsLegacy recovers words + wids from the `word`
// marks. This is the one-shot read used to flush an old editor state before
// reseeding it as plain text under a new epoch.
const Y = require("yjs")
const { prosemirrorJSONToYXmlFragment } = require("@tiptap/y-tiptap")
const {
  schema: legacySchema,
} = require(
  `${process.cwd()}/components/EditorHandler/schema/legacy/serverSchemaLegacy`,
)
const {
  docToTurnsLegacy,
} = require(
  `${process.cwd()}/components/EditorHandler/schema/legacy/docToTurnsLegacy`,
)
const {
  seedYDoc,
} = require(`${process.cwd()}/components/EditorHandler/schema/seedYDoc`)
const {
  docToTurns,
} = require(`${process.cwd()}/components/EditorHandler/schema/docToTurns`)

// Replica of the generation-1 turnsToDoc emission: each spoken word is a text
// node wearing the `word` mark { wid }, separated by unmarked space text nodes.
function legacyTurnsToDoc(mongoTurns) {
  return {
    type: "doc",
    content: mongoTurns.map((turn) => {
      const content = []
      turn.words.forEach((w, i) => {
        if (i > 0) content.push({ type: "text", text: " " })
        content.push({
          type: "text",
          text: w.word,
          marks: [{ type: "word", attrs: { wid: w.wid } }],
        })
      })
      return {
        type: "turn",
        attrs: {
          id: turn.turn_id,
          speakerId: turn.speaker_id || null,
          startTime: turn.stime,
          endTime: turn.etime,
          language: turn.language || "",
        },
        content,
      }
    }),
  }
}

function seedLegacyYDoc(turns) {
  const ydoc = new Y.Doc()
  prosemirrorJSONToYXmlFragment(
    legacySchema,
    legacyTurnsToDoc(turns),
    ydoc.getXmlFragment("default"),
  )
  return ydoc
}

const turns = [
  {
    turn_id: "t1",
    speaker_id: "spk",
    language: "fr-FR",
    stime: 0,
    etime: 2,
    words: [
      { wid: "w1", word: "bonjour" },
      { wid: "w2", word: "le" },
      { wid: "w3", word: "monde" },
    ],
  },
  {
    turn_id: "t2",
    speaker_id: null,
    language: "",
    words: [{ wid: "w4", word: "l'enfant ?" }],
  },
]

describe("legacy read path (generation-1 mark-based docs)", () => {
  test("words and wids are recovered from the word marks", () => {
    const ydoc = seedLegacyYDoc(turns)
    const out = docToTurnsLegacy(ydoc)

    expect(out).toHaveLength(2)
    expect(out[0].turn_id).toBe("t1")
    expect(out[0].speaker_id).toBe("spk")
    expect(out[0].language).toBe("fr-FR")
    expect(out[0].segment).toBe("bonjour le monde")
    expect(out[0].stime).toBe(0)
    expect(out[0].etime).toBe(2)
    expect(out[0].words).toEqual([
      { wid: "w1", word: "bonjour" },
      { wid: "w2", word: "le" },
      { wid: "w3", word: "monde" },
    ])
    // A word with an internal space is a single marked text node: one wid.
    expect(out[1].words).toEqual([{ wid: "w4", word: "l'enfant ?" }])
    expect(out[1].segment).toBe("l'enfant ?")
  })

  test("legacy read output reseeds as a plain-text doc (migration flow)", () => {
    const legacyDoc = seedLegacyYDoc(turns)
    const flushed = docToTurnsLegacy(legacyDoc)

    // Reseed the flushed turns through the CURRENT plain-text pipeline,
    // as the migration does after the epoch bump.
    const freshDoc = new Y.Doc()
    seedYDoc(freshDoc, flushed)
    const out = docToTurns(freshDoc)

    expect(out.map((t) => t.segment)).toEqual([
      "bonjour le monde",
      "l'enfant ?",
    ])
    expect(out[0].words).toBeUndefined()
    expect(out[0].stime).toBe(0)
    expect(out[0].etime).toBe(2)
  })
})
