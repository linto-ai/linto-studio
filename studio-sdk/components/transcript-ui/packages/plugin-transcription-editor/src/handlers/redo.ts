import type { EditorPluginState } from "../types"
import { getActiveTranslationStore } from "../tools/getActiveTranslationStore"
import { pushEditorCommand } from "../tools/pushEditorCommand"

/** Redo the active track's last-undone speaker mutation. Gated on the
 *  server-told redo target (see EditorPluginState.redoHeads) — there being
 *  nothing to redo is the common case, not an error. */
export function redo(state: EditorPluginState): void {
  if (state.core.capabilities.value.speakers !== "edit") return
  const store = getActiveTranslationStore(state.core)
  if (!state.options.redo || !store) return
  if (!state.redoHeads.get(store.id)) return

  // The current cursor, not the redo target — the server looks up what
  // comes next from it (see TranscriptionEditorRedoPayload).
  const revisionId = state.undoHeads.get(store.id) ?? null

  void pushEditorCommand(
    "redo",
    state.options.redo({ translationId: store.id, revisionId }),
  )
}
