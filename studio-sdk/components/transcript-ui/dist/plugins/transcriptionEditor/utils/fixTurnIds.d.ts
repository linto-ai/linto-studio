import { EditorState, Transaction } from '@tiptap/pm/state';
/**
 * Assign a fresh id to every turn with a missing (null) or duplicate id.
 * Returns a history-less transaction, or null when there is nothing to repair
 * (or the doc looks corrupt — too many to fix inline).
 */
export declare function fixTurnIds(state: EditorState): Transaction | null;
