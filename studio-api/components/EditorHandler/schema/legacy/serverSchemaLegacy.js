const { getSchema } = require("@tiptap/core")
const { Text } = require("@tiptap/extension-text")
const { TranscriptionDocument } = require("../transcriptionDocument")
const { TurnNode } = require("../turnNode")
const { WordMark } = require("./wordMark")

/**
 * LEGACY — generation-1 server schema (mark-based documents).
 *
 * The generation-1 doc carried word identity as inline `word` marks; the
 * current schema is plain-text and has no marks. This schema is used ONLY to
 * read generation-1 editor states during migration: decode the old state,
 * flush its content once, then reseed the document as plain text (epoch bump).
 *
 * TranscriptionDocument and TurnNode did not change between generations, so
 * they are required from the main schema folder.
 */
const extensions = [TranscriptionDocument, TurnNode, WordMark, Text]
const schema = getSchema(extensions)

module.exports = { extensions, schema }
