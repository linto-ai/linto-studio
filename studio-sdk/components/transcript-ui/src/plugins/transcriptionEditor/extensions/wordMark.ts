import { Mark, mergeAttributes } from "@tiptap/core"

/**
 * Inline mark carrying a word's identity (wid) inside the Y.Doc.
 *
 * Word identity now lives IN the document: each spoken word is a text node
 * wearing this mark, separated by unmarked whitespace. The server reads the
 * mark to map words by wid (no more text-diff guessing); timestamps stay out
 * of the doc (server-authoritative, keyed by wid).
 *
 * `inclusive` so typing inside/at the edge of a word keeps its wid (an edit,
 * not a new word). Attributes MUST be identical to the server-side wordMark.js.
 */
export const WordMark = Mark.create({
  name: "word",
  inclusive: true,

  addAttributes() {
    return {
      wid: {
        default: null,
        parseHTML: (element: HTMLElement): string | null =>
          element.getAttribute("data-wid"),
        renderHTML: (
          attributes: Record<string, unknown>,
        ): Record<string, string> =>
          attributes.wid ? { "data-wid": String(attributes.wid) } : {},
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
