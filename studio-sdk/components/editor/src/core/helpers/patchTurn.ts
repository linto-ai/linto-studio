import type { Turn } from "../../types/editor"
import { findTurnIndex } from "./findTurnIndex"

export function patchTurn(
  turns: Turn[],
  turnId: string,
  patch: Partial<Turn>,
): Turn | null {
  const idx = findTurnIndex(turns, turnId)
  if (idx === -1) return null
  const updated = { ...turns[idx]!, ...patch, id: turnId }
  turns[idx] = updated
  return updated
}
