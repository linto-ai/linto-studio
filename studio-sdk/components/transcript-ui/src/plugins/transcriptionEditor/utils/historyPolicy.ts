import type { Transaction } from "@tiptap/pm/state"

/**
 * Undo-history policy for the transcription editor.
 *
 * **Word/text edits are deliberately NOT undoable; only speaker changes are.**
 *
 * Why: enforcing the word-identity invariant (see fixWordMarks) means a
 * token-creating edit and its mark repair are written to the Y.Doc together but
 * cannot be captured as a single yUndo StackItem. Previously the repair alone
 * was flagged `addToHistory:false`, which left *some* edits undoable and others
 * not — an undo stack that diverged from the Y.Doc. Undo (or a remote change)
 * then reconciled a turn ProseMirror could no longer map, crashing renderDescs.
 *
 * Dropping ALL text edits from history makes capture uniform, so the doc can
 * never diverge and stays valid at every instant. Speaker changes are
 * attribute-only (no word repair) and users want them undoable, so
 * `speakerActions` tags those transactions with {@link KEEP_IN_HISTORY} to opt
 * back in. `storeSync` reads this policy when it appends its follow-up
 * transaction.
 */
export const KEEP_IN_HISTORY = "transcriptionEditor/keepInHistory"

/** Whether a change should remain in the undo history (a tagged speaker edit). */
export function keepsHistory(transactions: readonly Transaction[]): boolean {
  return transactions.some((tr) => tr.getMeta(KEEP_IN_HISTORY) === true)
}
