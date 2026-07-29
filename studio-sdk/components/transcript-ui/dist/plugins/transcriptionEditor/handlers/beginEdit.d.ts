import { EditorPluginState } from '../types';
/** Enter edit mode — once the server lock is granted (local-only without a
 *  lockTurn handler). Refusal simply doesn't enter; the holder from the ack
 *  keeps the badge honest even when the turn_locked broadcast was missed. */
export declare function beginEdit(state: EditorPluginState, turnId: string, caretOffset?: number): Promise<void>;
