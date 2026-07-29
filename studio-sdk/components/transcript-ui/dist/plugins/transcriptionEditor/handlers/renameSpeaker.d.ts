import { EditorPluginState } from '../types';
/** Rename a speaker. Applied at the speaker_renamed broadcast; local-only
 *  mode (no host handler) applies through the store helper. */
export declare function renameSpeaker(state: EditorPluginState, speakerId: string, name: string): void;
