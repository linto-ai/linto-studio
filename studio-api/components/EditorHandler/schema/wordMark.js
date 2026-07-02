const { Mark, mergeAttributes } = require("@tiptap/core")

/**
 * Inline mark carrying a word's identity (wid) inside the Y.Doc.
 *
 * Word identity now lives IN the document: each spoken word is a text node
 * wearing this mark, separated by unmarked whitespace. The server reads the
 * mark to map words by wid (no more text-diff guessing); timestamps stay out
 * of the doc (server-authoritative, keyed by wid).
 *
 * Attributes MUST be identical to the client-side wordMark.ts.
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
