import type { Turn } from "../../types/editor"
import { findTurnIndex } from "./findTurnIndex"

export function patchTurn(
  turns: Turn[],
  turnId: string,
  patch: Partial<Turn>,
): { turns: Turn[]; updated: Turn } | null {
  const idx = findTurnIndex(turns, turnId)
  if (idx === -1) return null
  const updated = { ...turns[idx]!, ...patch, id: turnId }
  const next = turns.slice()
  next[idx] = updated
  return { turns: next, updated }
}
