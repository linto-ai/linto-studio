import type { EditorPluginState } from "../types"
import { getActiveTranslationStore } from "../tools/getActiveTranslationStore"
import { pushEditorCommand } from "../tools/pushEditorCommand"

/** Undo the active track's current speaker mutation. No-op without a host
 *  handler, edit rights, or anything to undo — local-only mode has no
 *  history to rewind (see renameSpeaker.ts for the same host-handler gate).
 *  Fire-and-forget like the other speaker ops: the new cursor AND the
 *  resulting redo target both arrive on the broadcast (see
 *  applySpeakerRenamed et al / tools/trackUndoRedoHeads.ts), nothing is
 *  guessed here. */
export function undo(state: EditorPluginState): void {
  if (state.core.capabilities.value.speakers !== "edit") return
  const store = getActiveTranslationStore(state.core)
  if (!state.options.undo || !store) return
  const revisionId = state.undoHeads.get(store.id)
  if (!revisionId) return

  void pushEditorCommand(
    "undo",
    state.options.undo({ translationId: store.id, revisionId }),
  )
}
