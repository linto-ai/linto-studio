import type { Transaction } from "@tiptap/pm/state"

/**
 * Undo-history policy for the transcription editor.
 *
 * **Word/text edits are deliberately NOT undoable; only speaker changes are.**
 *
 * Why (HISTORICAL — from the word-mark era): enforcing the word-identity
 * invariant (the deleted fixWordMarks) meant a token-creating edit and its
 * mark repair were written to the Y.Doc together but could not be captured as
 * a single yUndo StackItem. Repair-only exclusion left *some* edits undoable
 * and others not — an undo stack diverging from the Y.Doc; undo (or a remote
 * change) then reconciled a turn ProseMirror could no longer map, crashing
 * renderDescs. The document is plain text now (no repairs), so re-enabling
 * text undo is likely SAFE — but that is a separate, deliberate decision, not
 * a side effect of the plain-text migration.
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
