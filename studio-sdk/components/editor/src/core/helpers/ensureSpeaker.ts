import type { Speaker } from "../../types/editor"
import { addSpeaker } from "./addSpeaker"

export function ensureSpeaker(
  speakers: Map<string, Speaker>,
  speakerId: string | null,
  name?: string,
): Speaker | null {
  if (!speakerId) return null
  if (speakers.has(speakerId)) return null
  return addSpeaker(speakers, speakerId, name ?? speakerId)
}
