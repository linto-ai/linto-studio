import type { EditorPluginState } from "../types"
import { mergeSpeakers } from "../../../core/helpers"
import { getActiveTranslationStore } from "../tools/getActiveTranslationStore"
import { pushEditorCommand } from "../tools/pushEditorCommand"

/** Reassign every turn of a speaker to another (speaker merge) — the
 *  replaced speaker disappears by construction. Applied at the
 *  speaker_replaced broadcast; local-only mode applies through the helper. */
export function replaceSpeaker(
  state: EditorPluginState,
  fromSpeakerId: string,
  toSpeakerId: string,
): void {
  if (state.core.capabilities.value.speakers !== "edit") return
  if (fromSpeakerId === toSpeakerId) return
  const { all } = state.core.speakers
  if (!all.has(fromSpeakerId) || !all.has(toSpeakerId)) return

  const store = getActiveTranslationStore(state.core)
  if (!state.options.replaceSpeaker || !store) {
    mergeSpeakers(state.core, fromSpeakerId, toSpeakerId)
    return
  }

  void pushEditorCommand(
    "replace_speaker",
    state.options.replaceSpeaker({
      translationId: store.id,
      fromSpeakerId,
      toSpeakerId,
    }),
  )
}
