import type { EditorPluginState } from "../types"

/**
 * Record a track's undo cursor and redo target from a speaker-mutation
 * broadcast. Called by every apply* handler that carries them
 * (applySpeakerRenamed, applyTurnSpeakerUpdated, applySpeakerReplaced,
 * applySpeakerRestored) — a normal edit and an undo/redo replaying one over
 * the SAME wire event are indistinguishable, and don't need to be
 * distinguished here: either way, this broadcast is server truth for
 * "where's the cursor" and "what would redo do from here".
 *
 * Missing (undefined) fields — a broadcast from before the undo/redo
 * feature — leave the previous state untouched rather than clobbering it
 * with unknown state.
 */
export function trackUndoRedoHeads(
  state: EditorPluginState,
  translationId: string,
  revisionId: string | null | undefined,
  redoRevisionId: string | null | undefined,
): void {
  if (revisionId !== undefined) state.undoHeads.set(translationId, revisionId)
  if (redoRevisionId !== undefined) {
    state.redoHeads.set(translationId, redoRevisionId)
  }
}
