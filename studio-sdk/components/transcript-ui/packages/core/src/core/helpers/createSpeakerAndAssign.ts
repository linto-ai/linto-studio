import type { Core } from "../types"
import { addSpeaker } from "./addSpeaker"
import { switchTurnSpeaker } from "./switchTurnSpeaker"

export function createSpeakerAndAssign(
  core: Core,
  turnId: string,
  name: string,
): string | null {
  const trimmed = name.trim()
  if (!trimmed) return null
  const speaker = addSpeaker(core.speakers.all, crypto.randomUUID(), trimmed)
  core.speakers.updateOrCreate(speaker)
  switchTurnSpeaker(core, turnId, speaker.id)
  return speaker.id
}
