import type { Turn } from "../../types/editor"

export function findTurnIndex(turns: Turn[], turnId: string): number {
  return turns.findIndex((t) => t.id === turnId)
}
