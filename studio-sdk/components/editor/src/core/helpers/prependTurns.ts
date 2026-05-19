import type { Turn } from "../../types/editor"

export function prependTurns(existing: Turn[], newTurns: Turn[]): Turn[] {
  return [...newTurns, ...existing]
}
