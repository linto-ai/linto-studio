import type { Core } from "../types"

/** Number of turns assigned to a speaker in the active translation — what the
 *  user currently sees (merge dialog, speaker menus). */
export function countTurnsForSpeaker(core: Core, speakerId: string): number {
  const translation = core.activeChannel.value?.activeTranslation.value
  if (!translation) return 0
  return translation.turns.value.filter((t) => t.speakerId === speakerId).length
}
