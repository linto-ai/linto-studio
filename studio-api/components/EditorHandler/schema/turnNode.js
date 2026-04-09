const { Node, mergeAttributes } = require("@tiptap/core")

/**
 * Headless turn node for server-side schema.
 * Attributes MUST be identical to the client-side turnNode.ts.
 */
const TurnNode = Node.create({
  name: "turn",
  group: "block",
  content: "inline*",

  addAttributes() {
    return {
      id: { default: null },
      speakerId: { default: null },
      startTime: { default: undefined },
      endTime: { default: undefined },
      language: { default: "" },
    }
  },

  parseHTML() {
    return [{ tag: 'section[data-type="turn"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "section",
      mergeAttributes(HTMLAttributes, { "data-type": "turn" }),
      0,
    ]
  },
  // No addNodeView — headless server
})

module.exports = { TurnNode }
