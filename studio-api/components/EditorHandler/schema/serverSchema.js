const { getSchema } = require("@tiptap/core")
const { Text } = require("@tiptap/extension-text")
const { TranscriptionDocument } = require("./transcriptionDocument")
const { TurnNode } = require("./turnNode")

/**
 * Single source of truth for the server-side ProseMirror/TipTap schema.
 *
 * Both the seed path (turns -> Y.Doc) and the flush path (Y.Doc -> turns) MUST
 * build from the exact same extension list. Keep this in sync with the client
 * extension list (transcriptionDocument, turnNode, text).
 *
 * Turns carry PLAIN TEXT — no marks. Word identity and timestamps live
 * outside the doc (WordsState / Mongo), aligned to the text by tokenization
 * (see words/tokenize.js). Generation-1 mark-based documents are read through
 * schema/legacy/ during migration.
 */
const extensions = [TranscriptionDocument, TurnNode, Text]
const schema = getSchema(extensions)

module.exports = { extensions, schema }
