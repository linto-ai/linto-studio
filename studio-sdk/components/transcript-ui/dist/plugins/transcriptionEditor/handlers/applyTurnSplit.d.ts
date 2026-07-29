import { TurnSplit } from '../../../core/types';
import { EditorPluginState } from '../types';
/** Apply a turn split broadcast by the server: replace the original turn by
 *  its two halves, in place. */
export declare function applyTurnSplit(state: EditorPluginState, split: TurnSplit): void;
