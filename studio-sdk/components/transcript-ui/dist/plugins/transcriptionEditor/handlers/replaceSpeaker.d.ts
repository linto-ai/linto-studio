import { EditorPluginState } from '../types';
/** Reassign every turn of a speaker to another (speaker merge) — the
 *  replaced speaker disappears by construction. Applied at the
 *  speaker_replaced broadcast; local-only mode applies through the helper. */
export declare function replaceSpeaker(state: EditorPluginState, fromSpeakerId: string, toSpeakerId: string): void;
