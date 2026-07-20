const Y = require("yjs")
const { prosemirrorJSONToYXmlFragment } = require("@tiptap/y-tiptap")
const { schema } = require("./serverSchema")
const { turnsToDoc } = require("./turnsToDoc")

// Seed via a throwaway doc with a FIXED client id so every replica emits
// byte-identical ops the CRDT dedupes (else concurrent loads double the doc).
const SEED_CLIENT_ID = 0

function seedYDoc(ydoc, mongoTurns, field = "default") {
  const turnsFragment = ydoc.getXmlFragment(field)
  if (turnsFragment.length > 0) return // Already seeded

  if (!mongoTurns || mongoTurns.length === 0) return

  const seedDoc = new Y.Doc()
  seedDoc.clientID = SEED_CLIENT_ID
  const content = turnsToDoc(mongoTurns)
  prosemirrorJSONToYXmlFragment(schema, content, seedDoc.getXmlFragment(field))
  Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(seedDoc))
}

module.exports = { seedYDoc, schema }
