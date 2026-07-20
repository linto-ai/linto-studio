import type { Node as ProseMirrorNode } from "@tiptap/pm/model"
import type { Turn } from "../../../types/editor"
import { wordsFromText } from "../../../utils/turnWords"

/**
 * Convert a single ProseMirror "turn" node into a Turn.
 *
 * The document is plain text: words are DERIVED by tokenizing the turn's text
 * (identity is positional — see turnWords.ts). Timestamps are NOT in the doc;
 * they are carried over from the previous store state
 * (mergeTurnPreservingWords) and refreshed by the server's timestamps_recalc
 * broadcasts (applyStatelessPayload).
 *
 * A turn whose id is still null (freshly split, waiting for the server-assigned
 * id) yields an empty-id Turn — callers skip those before mirroring.
 */
export function nodeToTurn(node: ProseMirrorNode): Turn {
  const id = (node.attrs.id as string | null) ?? ""
  const text = node.textContent
  const words = wordsFromText(id, text)

  return {
    id,
    speakerId: (node.attrs.speakerId as string) ?? null,
    // text is the source only for a word-less (live text-only) turn.
    text: words.length > 0 ? null : text || null,
    words,
    startTime: node.attrs.startTime as number | undefined,
    endTime: node.attrs.endTime as number | undefined,
    startDate: node.attrs.startDate as number | undefined,
    endDate: node.attrs.endDate as number | undefined,
    language: (node.attrs.language as string) ?? "",
  }
}
