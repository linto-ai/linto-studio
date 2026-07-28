import { TurnsMerged } from '../../../core/types';
import { EditorPluginState } from '../types';
/** Apply a merge broadcast: replace the surviving turn by the merged result,
 *  drop the other — adjacency makes the final position identical either way. */
export declare function applyTurnsMerged(state: EditorPluginState, merge: TurnsMerged): void;
