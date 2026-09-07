import type { Turn } from "../../types/editor"

export function ensureSpeakersFromTurns(
  turns: Turn[],
  ensure: (speakerId: string | null, name?: string) => void,
): void {
  const seen = new Set<string>()
  for (const turn of turns) {
    if (turn.speakerId && !seen.has(turn.speakerId)) {
      seen.add(turn.speakerId)
      ensure(turn.speakerId)
    }
  }
}
