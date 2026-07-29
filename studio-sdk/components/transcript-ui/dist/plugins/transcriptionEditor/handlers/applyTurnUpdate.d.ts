import { TurnUpdate } from '../../../core/types';
import { EditorPluginState } from '../types';
/** Apply a saved turn broadcast by the server (any track, any author). */
export declare function applyTurnUpdate(state: EditorPluginState, update: TurnUpdate): void;
