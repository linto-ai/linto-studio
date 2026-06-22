import type { EditorState, Transaction } from "@tiptap/pm/state"

// Above this many missing/duplicate ids means corrupt data; skip the inline
// repair (rewriting thousands of ids in one transaction freezes the tab).
const MAX_DUPLICATE_REPAIR = 100

/**
 * Assign a fresh id to every turn with a missing (null) or duplicate id. A
 * count-preserving paste can introduce one without changing childCount, so this
 * runs on every local change. Returns a history-less transaction, or null when
 * there is nothing to repair (or the doc looks corrupt — too many to fix inline).
 */
export function fixTurnIds(state: EditorState): Transaction | null {
  const seen = new Set<string>()
  const invalid: Array<{ pos: number; attrs: Record<string, unknown> }> = []

  state.doc.forEach((node, offset) => {
    if (node.type.name !== "turn") return
    const id = node.attrs.id as string | null
    if (!id || seen.has(id)) {
      invalid.push({ pos: offset, attrs: node.attrs })
      return
    }
    seen.add(id)
  })

  if (invalid.length === 0) return null

  if (invalid.length > MAX_DUPLICATE_REPAIR) {
    console.warn(
      `[storeSync] ${invalid.length} turns with missing/duplicate ids — skipping inline repair (likely corrupt data)`,
    )
    return null
  }

  const tr = state.tr
  for (const { pos, attrs } of invalid) {
    tr.setNodeMarkup(pos, undefined, { ...attrs, id: crypto.randomUUID() })
  }
  tr.setMeta("addToHistory", false)
  return tr
}
