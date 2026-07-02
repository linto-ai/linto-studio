import { EditorState, Transaction } from '@tiptap/pm/state';
/**
 * Enforce the word-identity invariant on every local change (mirrors
 * fixTurnIds): **one `word` mark = one whitespace-delimited token = one unique
 * wid**, whitespace unmarked. A single symmetric rule repairs every case:
 *
 * For each whitespace-delimited token, its wid is the wid of its first marked
 * character — UNLESS that wid was already claimed by an earlier token in the
 * same turn (or the char is unmarked), in which case a fresh wid is minted.
 *
 *  - typed/pasted text (unmarked)      → fresh wid per token
 *  - a mark grown across a space (split: "le genre" both w1) → "le" keeps w1,
 *    "genre" sees w1 already used → fresh wid
 *  - two words glued by deleting the space (merge: "legenre" = w1·w2) → one
 *    token, first char is w1 → whole token becomes w1, w2 dropped
 *  - a plain in-word edit → token stays uniform, no change
 *
 * Only the turns overlapping the range changed by `transactions` are scanned
 * (with a selection-turn fallback for mark-only re-runs), so cost is
 * proportional to the edit, not to the transcript length. Returns a
 * history-less transaction, or null when nothing needs repair.
 */
export declare function fixWordMarks(state: EditorState, transactions: readonly Transaction[]): Transaction | null;
