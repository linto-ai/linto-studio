import type { Turn } from "../../types/editor"

export function insertTurn(turns: Turn[], turn: Turn): void {
  turns.push(turn)
}
