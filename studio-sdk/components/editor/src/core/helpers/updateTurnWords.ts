import type { Turn, Word } from "../../types/editor"

export function updateTurnWords(
  turns: Turn[],
  turnId: string,
  words: Word[],
): { turns: Turn[]; updated: Turn } | null {
  const idx = turns.findIndex((t) => t.id === turnId)
  if (idx === -1) return null
  const turn = turns[idx]!
  const updated = {
    ...turn,
    words,
    text: null,
    startTime: words[0]?.startTime ?? turn.startTime,
    endTime: words[words.length - 1]?.endTime ?? turn.endTime,
  }
  return {
    turns: turns.map((t, i) => (i === idx ? updated : t)),
    updated,
  }
}
