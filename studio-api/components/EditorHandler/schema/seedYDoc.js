const { getSchema } = require("@tiptap/core")
const { prosemirrorJSONToYXmlFragment } = require("@tiptap/y-tiptap")
const { TranscriptionDocument } = require("./transcriptionDocument")
const { TurnNode } = require("./turnNode")
const { Text } = require("@tiptap/extension-text")
const { turnsToDoc } = require("./turnsToDoc")

const extensions = [TranscriptionDocument, TurnNode, Text]
const schema = getSchema(extensions)

/**
 * Seed a Y.Doc with MongoDB turns.
 * Skips if the fragment already has content (e.g., restored from Redis).
 *
 * @param {import("yjs").Doc} ydoc
 * @param {Array} mongoTurns - Turns in MongoDB format
 * @param {string} field - Y.XmlFragment field name
 */
function seedYDoc(ydoc, mongoTurns, field = "default") {
  const fragment = ydoc.getXmlFragment(field)
  if (fragment.length > 0) return // Already seeded

  if (!mongoTurns || mongoTurns.length === 0) return

  const content = turnsToDoc(mongoTurns)
  prosemirrorJSONToYXmlFragment(schema, content, fragment)
}

module.exports = { seedYDoc, schema }
