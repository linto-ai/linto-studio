import type { Turn } from "../../types/editor"
import { findTurnIndex } from "./findTurnIndex"

export function removeTurn(turns: Turn[], turnId: string): Turn[] | null {
  const idx = findTurnIndex(turns, turnId)
  if (idx === -1) return null
  return turns.filter((_, i) => i !== idx)
}
