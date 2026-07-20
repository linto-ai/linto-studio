import type { Core } from "../types"

/** Reassign every turn of the merged-away speaker to the surviving one, then
 *  drop the merged-away speaker — in that order, so no turn ever references a
 *  removed speaker. */
export function mergeSpeakers(
  core: Core,
  fromSpeakerId: string,
  toSpeakerId: string,
): void {
  if (fromSpeakerId === toSpeakerId) return
  if (
    !core.speakers.all.has(fromSpeakerId) ||
    !core.speakers.all.has(toSpeakerId)
  ) {
    return
  }

  for (const channel of core.channels.values()) {
    for (const translation of channel.translations.values()) {
      for (const turn of translation.turns.value) {
        if (turn.speakerId === fromSpeakerId) {
          translation.updateTurn(turn.id, { speakerId: toSpeakerId })
        }
      }
    }
  }
  core.speakers.delete(fromSpeakerId)
}
