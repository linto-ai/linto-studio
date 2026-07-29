import { TurnSpeakerUpdated } from '../../../core/types';
import { EditorPluginState } from '../types';
/** Apply a turn↔speaker assignment broadcast by the server, including its
 *  GC consequence (removedSpeakerId rides the broadcast). */
export declare function applyTurnSpeakerUpdated(state: EditorPluginState, update: TurnSpeakerUpdated): void;
