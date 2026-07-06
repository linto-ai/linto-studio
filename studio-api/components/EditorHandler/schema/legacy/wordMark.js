const { Mark, mergeAttributes } = require("@tiptap/core")

/**
 * LEGACY — generation-1 schema (mark-based documents).
 *
 * Frozen copy of the inline `word` mark that used to carry a word's identity
 * (wid) inside the Y.Doc. The current schema is plain-text (no marks); this
 * module exists ONLY so the migration read path can decode editor states
 * produced before the plain-text switch: read the old doc once, flush its
 * content, then reseed it as plain text under a new epoch.
 */
const WordMark = Mark.create({
  name: "word",
  inclusive: true,

  addAttributes() {
    return {
      wid: {
        default: null,
        parseHTML: (el) => el.getAttribute("data-wid"),
        renderHTML: (attrs) => (attrs.wid ? { "data-wid": attrs.wid } : {}),
      },
    }
  },

  parseHTML() {
    return [{ tag: "span[data-wid]" }]
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes), 0]
  },
})

module.exports = { WordMark }
