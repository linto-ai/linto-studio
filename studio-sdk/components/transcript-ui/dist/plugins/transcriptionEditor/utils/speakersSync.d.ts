import { Doc } from 'yjs';
import { Core, TranslationStore } from '../../../core/types';
export declare const SPEAKERS_MAP_KEY = "speakers";
/** Color may be absent when the server seeded the Y.Map (server doesn't persist colors). */
export interface SpeakerData {
    name: string;
    color?: string;
}
export interface SetupSpeakersSyncOptions {
    core: Core;
    ydoc: Doc;
    translation: TranslationStore;
    /** When true, seed the Y.Map from core.speakers for speakers referenced
     *  by the translation's turns (local mode only). In collab mode the server seeds. */
    seedFromCore: boolean;
}
/**
 * Wires bidirectional sync between core.speakers (Vue store) and a Y.Map
 * of speakers scoped to a translation's Y.Doc. Returns a cleanup function.
 */
export declare function setupSpeakersSync(options: SetupSpeakersSyncOptions): () => void;
