import type { Turn, Word } from "../../types/editor"
import { findTurnIndex } from "./findTurnIndex"

export function updateTurnWords(
  turns: Turn[],
  turnId: string,
  words: Word[],
): Turn | null {
  const idx = findTurnIndex(turns, turnId)
  if (idx === -1) return null
  const turn = turns[idx]!
  const updated = {
    ...turn,
    words,
    text: null,
    startTime: words[0]?.startTime ?? turn.startTime,
    endTime: words[words.length - 1]?.endTime ?? turn.endTime,
  }
  turns[idx] = updated
  return updated
}
