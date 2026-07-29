import { EditorPluginState } from '../types';
/**
 * Point a turn at a speaker: an existing one (speakerId) or a new one
 * created by name — exactly one of the two. With a host handler the change
 * is applied at the turn_speaker_updated broadcast (the server mints the
 * created id); without one (local-only mode) the store helpers apply it.
 */
export declare function updateTurnSpeaker(state: EditorPluginState, turnId: string, target: {
    speakerId?: string;
    speakerName?: string;
}): void;
