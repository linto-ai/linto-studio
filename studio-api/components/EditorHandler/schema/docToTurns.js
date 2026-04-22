const { yXmlFragmentToProsemirrorJSON } = require("@tiptap/y-tiptap")
const { getSchema } = require("@tiptap/core")
const { TranscriptionDocument } = require("./transcriptionDocument")
const { TurnNode } = require("./turnNode")
const { Text } = require("@tiptap/extension-text")

const extensions = [TranscriptionDocument, TurnNode, Text]
const schema = getSchema(extensions)

/**
 * Extract turns from a Y.Doc in MongoDB format.
 *
 * Converts Y.XmlFragment → ProseMirror JSON → MongoDB-format turns[].
 * Words/timestamps are NOT in the Y.Doc — only text survives the round-trip.
 *
 * @param {import("yjs").Doc} ydoc
 * @param {string} field - Y.XmlFragment field name
 * @returns {{ turn_id: string, speaker_id: string|null, segment: string, raw_segment: string, words: [], language: string }[]}
 */
function docToTurns(ydoc, field = "default") {
  const fragment = ydoc.getXmlFragment(field)
  const json = yXmlFragmentToProsemirrorJSON(fragment, schema)

  if (!json || !json.content) return []

  return json.content
    .filter((node) => node.type === "turn")
    .map((node) => {
      const text = (node.content || [])
        .filter((c) => c.type === "text")
        .map((c) => c.text)
        .join("")

      return {
        turn_id: node.attrs.id,
        speaker_id: node.attrs.speakerId || null,
        segment: text,
        raw_segment: text,
        words: [],
        language: node.attrs.language || "",
      }
    })
}

module.exports = { docToTurns }
