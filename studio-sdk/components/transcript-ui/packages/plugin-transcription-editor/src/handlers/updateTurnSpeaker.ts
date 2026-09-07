import type { EditorPluginState } from "../types"
import { helpers } from "@linto-ai/transcript-ui-core"

const { switchTurnSpeaker, createSpeakerAndAssign } = helpers
import { getActiveTranslationStore } from "../tools/getActiveTranslationStore"
import { pushEditorCommand } from "../tools/pushEditorCommand"

/**
 * Point a turn at a speaker: an existing one (speakerId) or a new one
 * created by name — exactly one of the two. With a host handler the change
 * is applied at the turn_speaker_updated broadcast (the server mints the
 * created id); without one (local-only mode) the store helpers apply it.
 */
export function updateTurnSpeaker(
  state: EditorPluginState,
  turnId: string,
  target: { speakerId?: string; speakerName?: string },
): void {
  if (state.core.capabilities.value.speakers !== "edit") return
  const store = getActiveTranslationStore(state.core)
  if (!store?.hasTurn(turnId)) return

  const speakerName = target.speakerName?.trim() ?? ""
  const hasId = !!target.speakerId
  if (hasId === !!speakerName) return
  if (hasId && store.getTurn(turnId)?.speakerId === target.speakerId) return

  if (!state.options.updateTurnSpeaker) {
    if (hasId) switchTurnSpeaker(state.core, turnId, target.speakerId!)
    else createSpeakerAndAssign(state.core, turnId, speakerName)
    return
  }

  void pushEditorCommand(
    "update_turn_speaker",
    state.options.updateTurnSpeaker({
      translationId: store.id,
      turnId,
      ...(hasId ? { speakerId: target.speakerId } : { speakerName }),
    }),
  )
}
