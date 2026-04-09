const { Node } = require("@tiptap/core")

/**
 * Custom Document node that only accepts `turn` blocks.
 * Replaces TipTap's default `doc` node.
 */
const TranscriptionDocument = Node.create({
  name: "doc",
  topNode: true,
  content: "turn+",
})

module.exports = { TranscriptionDocument }
