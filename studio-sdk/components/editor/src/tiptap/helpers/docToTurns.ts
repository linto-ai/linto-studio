import type { Node as ProseMirrorNode } from "@tiptap/pm/model"
import type { Turn } from "../../types/editor"

/**
 * Extract Turn[] from a ProseMirror document.
 * Only extracts the text + attributes — words/timestamps are NOT in ProseMirror,
 * they must be merged separately from the backend metadata.
 */
export function docToTurns(doc: ProseMirrorNode): Turn[] {
  const turns: Turn[] = []

  doc.forEach((node) => {
    if (node.type.name !== "turn") return

    const text = node.textContent
    turns.push({
      id: node.attrs.id as string,
      speakerId: (node.attrs.speakerId as string) ?? null,
      text: text || null,
      words: [],
      startTime: node.attrs.startTime as number | undefined,
      endTime: node.attrs.endTime as number | undefined,
      language: (node.attrs.language as string) ?? "",
    })
  })

  return turns
}
