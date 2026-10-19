import type { Speaker } from "../../types/editor"
import { SPEAKER_COLORS } from "../../constants/speakers"

export function addSpeaker(
  speakers: Map<string, Speaker>,
  id: string,
  name: string,
  defined?: boolean,
): Speaker {
  const color = SPEAKER_COLORS[speakers.size % SPEAKER_COLORS.length]!
  const speaker: Speaker = { id, name, color }
  // Only carried when known: absent means a real name (see Speaker.defined).
  if (defined !== undefined) speaker.defined = defined
  return speaker
}
