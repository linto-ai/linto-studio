import type { Speaker, Turn } from "../../types/editor"

/** Speakers referenced by the turns, in store order. The store spans every
 *  loaded track: a listing shows only the active one's. */
export function listActiveSpeakers(
  turns: Turn[],
  speakers: Map<string, Speaker>,
): Speaker[] {
  const usedIds = new Set(turns.map((turn) => turn.speakerId))
  return Array.from(speakers.values()).filter((speaker) =>
    usedIds.has(speaker.id),
  )
}
