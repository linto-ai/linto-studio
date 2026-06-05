const Y = require("yjs")
const { getSchema } = require("@tiptap/core")
const { prosemirrorJSONToYXmlFragment } = require("@tiptap/y-tiptap")
const { TranscriptionDocument } = require("./transcriptionDocument")
const { TurnNode } = require("./turnNode")
const { Text } = require("@tiptap/extension-text")
const { turnsToDoc } = require("./turnsToDoc")

const extensions = [TranscriptionDocument, TurnNode, Text]
const schema = getSchema(extensions)

// Seeding runs independently on every server instance. Building the content
// directly in the live Y.Doc makes each replica emit its own Yjs operations,
// so concurrent loads merge into a duplicated document. Instead we build the
// seed in a throwaway doc with a FIXED client id and apply its encoded update:
// every instance then produces byte-identical operations that the CRDT
// deduplicates. seedSpeakers uses a different fixed id so the two seed updates
// don't share a (client, clock) space when applied to the same document.
const SEED_CLIENT_ID = 0

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

  const seedDoc = new Y.Doc()
  seedDoc.clientID = SEED_CLIENT_ID
  const content = turnsToDoc(mongoTurns)
  prosemirrorJSONToYXmlFragment(schema, content, seedDoc.getXmlFragment(field))
  Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(seedDoc))
}

module.exports = { seedYDoc, schema }
