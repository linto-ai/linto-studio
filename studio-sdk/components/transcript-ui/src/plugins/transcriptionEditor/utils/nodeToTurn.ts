import type { Node as ProseMirrorNode } from "@tiptap/pm/model"
import type { Turn } from "../../../types/editor"

/**
 * Convert a single ProseMirror "turn" node into a Turn.
 * Only the text + attributes are extracted — words/timestamps live outside
 * ProseMirror and must be merged from backend metadata separately.
 */
export function nodeToTurn(node: ProseMirrorNode): Turn {
  return {
    id: node.attrs.id as string,
    speakerId: (node.attrs.speakerId as string) ?? null,
    text: node.textContent || null,
    words: [],
    startTime: node.attrs.startTime as number | undefined,
    endTime: node.attrs.endTime as number | undefined,
    startDate: node.attrs.startDate as number | undefined,
    endDate: node.attrs.endDate as number | undefined,
    language: (node.attrs.language as string) ?? "",
  }
}
