import type { Node as ProseMirrorNode } from "@tiptap/pm/model"
import type { Turn } from "../../../types/editor"
import { nodeToTurn } from "./nodeToTurn"

/**
 * Extract Turn[] from a ProseMirror document.
 * Only extracts the text + attributes — words/timestamps are NOT in ProseMirror,
 * they must be merged separately from the backend metadata.
 */
export function docToTurns(doc: ProseMirrorNode): Turn[] {
  const turns: Turn[] = []
  doc.forEach((node) => {
    if (node.type.name !== "turn") return
    turns.push(nodeToTurn(node))
  })
  return turns
}
