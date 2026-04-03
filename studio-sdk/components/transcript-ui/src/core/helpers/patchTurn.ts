import type { Turn } from "../../types/editor"

export function patchTurn(
  turns: Turn[],
  turnId: string,
  patch: Partial<Turn>,
): { turns: Turn[]; updated: Turn } | null {
  const idx = turns.findIndex((t) => t.id === turnId)
  if (idx === -1) return null
  const updated = { ...turns[idx]!, ...patch, id: turnId }
  return {
    turns: turns.map((t, i) => (i === idx ? updated : t)),
    updated,
  }
}
