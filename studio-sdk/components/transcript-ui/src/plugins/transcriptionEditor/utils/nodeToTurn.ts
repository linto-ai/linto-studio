import type { Node as ProseMirrorNode } from "@tiptap/pm/model"
import type { Turn, Word } from "../../../types/editor"

/**
 * Convert a single ProseMirror "turn" node into a Turn.
 *
 * Word IDENTITY is read from the inline `word` mark on each text node (wid →
 * Word.id); timestamps are NOT in the doc — they are merged in separately, by
 * wid, from the server (mergeTurnPreservingWords for locally-known words,
 * applyStatelessPayload for freshly recomputed ones).
 */
export function nodeToTurn(node: ProseMirrorNode): Turn {
  const words: Word[] = []
  node.forEach((child) => {
    if (!child.isText) return
    const wordMark = child.marks.find((m) => m.type.name === "word")
    if (wordMark && wordMark.attrs.wid) {
      words.push({ id: wordMark.attrs.wid as string, text: child.text ?? "" })
    }
  })

  return {
    id: node.attrs.id as string,
    speakerId: (node.attrs.speakerId as string) ?? null,
    // text is the source only for a word-less (live text-only) turn.
    text: words.length > 0 ? null : node.textContent || null,
    words,
    startTime: node.attrs.startTime as number | undefined,
    endTime: node.attrs.endTime as number | undefined,
    startDate: node.attrs.startDate as number | undefined,
    endDate: node.attrs.endDate as number | undefined,
    language: (node.attrs.language as string) ?? "",
  }
}
