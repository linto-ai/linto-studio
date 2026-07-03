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
 *
 * KNOWN BUG (Firefox only, accepted): because every word is a span, a turn's
 * content always ends with an inline element. Replacing the LAST word of a turn
 * and typing makes Firefox place the caret OUTSIDE that span (nothing after it
 * anchors the caret), so the next character lands in a bare text node that PM
 * fails to reconcile (empty node, caret stuck). Middle words are fine — the
 * trailing space anchors the caret. A trailing-anchor fix exists but must NOT be
 * a ProseMirror decoration inside the content (it races PM's reconciliation and
 * crashes renderDescs — see wordHighlight.ts); the safe fix is a non-decoration
 * trailing node, which requires restructuring TurnNodeView's contentDOM. Shipped
 * as a known bug: narrow (last-word replacement), Firefox-only, low blast radius.
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
