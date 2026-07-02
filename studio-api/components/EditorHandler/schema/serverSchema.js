const { getSchema } = require("@tiptap/core")
const { Text } = require("@tiptap/extension-text")
const { TranscriptionDocument } = require("./transcriptionDocument")
const { TurnNode } = require("./turnNode")
const { WordMark } = require("./wordMark")

/**
 * Single source of truth for the server-side ProseMirror/TipTap schema.
 *
 * Both the seed path (turns -> Y.Doc) and the flush path (Y.Doc -> turns) MUST
 * build from the exact same extension list, or the `word` mark round-trips
 * inconsistently and wids are silently dropped. Keep this in sync with the
 * client extension list (transcriptionDocument, turnNode, wordMark, text).
 */
const extensions = [TranscriptionDocument, TurnNode, WordMark, Text]
const schema = getSchema(extensions)

module.exports = { extensions, schema }
