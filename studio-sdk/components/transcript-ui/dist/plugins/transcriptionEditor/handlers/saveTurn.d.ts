import { EditorPluginState } from '../types';
/** Commit the edited text: optimistic local apply, then the sequenced
 *  network push (save, then unlock). */
export declare function saveTurn(state: EditorPluginState, text: string): void;
