import type { Core } from "../types"

/** Point a turn at another speaker, in every translation that carries the
 *  turn (translations of a channel share turn ids). */
export function switchTurnSpeaker(
  core: Core,
  turnId: string,
  newSpeakerId: string,
): void {
  for (const channel of core.channels.values()) {
    for (const translation of channel.translations.values()) {
      const turn = translation.getTurn(turnId)
      if (!turn || turn.speakerId === newSpeakerId) continue
      translation.updateTurn(turnId, { speakerId: newSpeakerId })
    }
  }
}
