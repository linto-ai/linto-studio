import type { Speaker } from "../../types/editor"

export function updateSpeaker(
  speakers: Map<string, Speaker>,
  speakerId: string,
  patch: Partial<Omit<Speaker, "id">>,
): Speaker | null {
  const existing = speakers.get(speakerId)
  if (!existing) return null
  return { ...existing, ...patch }
}
