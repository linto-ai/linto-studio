import { TurnDeleted } from '../../../core/types';
import { EditorPluginState } from '../types';
/** Apply a turn deletion broadcast by the server, including its GC
 *  consequence (removedSpeakerId rides the broadcast). */
export declare function applyTurnDeleted(state: EditorPluginState, deleted: TurnDeleted): void;
