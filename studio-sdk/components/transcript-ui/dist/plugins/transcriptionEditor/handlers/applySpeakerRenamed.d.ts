import { SpeakerRenamed } from '../../../core/types';
import { EditorPluginState } from '../types';
/** Apply a speaker rename broadcast by the server — the speakers store is
 *  document-global, no per-track guard needed. */
export declare function applySpeakerRenamed(state: EditorPluginState, renamed: SpeakerRenamed): void;
