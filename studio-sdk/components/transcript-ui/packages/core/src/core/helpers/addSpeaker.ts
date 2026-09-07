import type { Speaker } from "../../types/editor"
import { SPEAKER_COLORS } from "../../constants/speakers"

export function addSpeaker(
  speakers: Map<string, Speaker>,
  id: string,
  name: string,
): Speaker {
  const color = SPEAKER_COLORS[speakers.size % SPEAKER_COLORS.length]!
  return { id, name, color }
}
