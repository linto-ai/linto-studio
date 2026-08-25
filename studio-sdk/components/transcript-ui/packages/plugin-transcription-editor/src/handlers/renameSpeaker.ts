import type { EditorPluginState } from "../types"
import { helpers } from "@linto/transcript-ui-core"

const { renameSpeaker: renameSpeakerLocally } = helpers
import { getActiveTranslationStore } from "../tools/getActiveTranslationStore"
import { pushEditorCommand } from "../tools/pushEditorCommand"

/** Rename a speaker. Applied at the speaker_renamed broadcast; local-only
 *  mode (no host handler) applies through the store helper. */
export function renameSpeaker(
  state: EditorPluginState,
  speakerId: string,
  name: string,
): void {
  if (state.core.capabilities.value.speakers !== "edit") return
  const trimmed = name.trim()
  const existing = state.core.speakers.all.get(speakerId)
  if (!existing || !trimmed || trimmed === existing.name) return

  const store = getActiveTranslationStore(state.core)
  if (!state.options.renameSpeaker || !store) {
    renameSpeakerLocally(state.core, speakerId, trimmed)
    return
  }

  void pushEditorCommand(
    "rename_speaker",
    state.options.renameSpeaker({
      translationId: store.id,
      speakerId,
      name: trimmed,
    }),
  )
}
