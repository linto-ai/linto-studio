import { SpeakerReplaced } from '../../../core/types';
import { EditorPluginState } from '../types';
/** Apply a speaker replacement broadcast by the server: reassign the track's
 *  turns, then drop the replaced speaker (implied removal). */
export declare function applySpeakerReplaced(state: EditorPluginState, replaced: SpeakerReplaced): void;
