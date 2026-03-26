import type { Turn } from "../../types/editor"

export function insertTurn(turns: Turn[], turn: Turn): Turn[] {
  return [...turns, turn]
}
