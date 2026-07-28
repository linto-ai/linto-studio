import { EditorPluginState } from '../types';
/**
 * Enter gesture: commit the text (optimistic, like saveTurn), then ask the
 * server to split at the caret. The split itself is NOT applied locally —
 * the turn_split broadcast is the single application path (no duplicated
 * cut logic client-side).
 */
export declare function splitTurn(state: EditorPluginState, text: string, offset: number): void;
