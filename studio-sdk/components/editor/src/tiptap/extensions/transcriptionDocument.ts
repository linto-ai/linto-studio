import { Node } from "@tiptap/core"

/**
 * Custom Document node that only accepts `turn` blocks.
 * Replaces TipTap's default `doc` node.
 */
export const TranscriptionDocument = Node.create({
  name: "doc",
  topNode: true,
  content: "turn+",
})
