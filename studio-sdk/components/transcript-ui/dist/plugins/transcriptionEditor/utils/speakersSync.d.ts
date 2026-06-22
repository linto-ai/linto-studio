import { Doc } from 'yjs';
import { Core, SpeakersStore, TranslationStore } from '../../../core/types';
export declare const SPEAKERS_MAP_KEY = "speakers";
/** Color may be absent when the server seeded the Y.Map (server doesn't persist colors). */
export interface SpeakerData {
    name: string;
    color?: string;
}
/**
 * Seed the Y.Map from core speakers referenced by the translation's turns.
 * Local mode only — in collab mode the server seeds the map.
 */
export declare function seedSpeakersMap(ydoc: Doc, translation: TranslationStore, speakers: SpeakersStore): void;
/**
 * Bidirectional sync between core.speakers (Vue store) and the speakers
 * Y.Map of a translation's Y.Doc. Construction imports the current Y state
 * into the core; destroy() releases every subscription.
 */
export declare class SpeakersSync {
    private readonly core;
    private readonly speakersMap;
    private readonly observer;
    private readonly offCoreEvents;
    constructor(core: Core, ydoc: Doc);
    destroy(): void;
    private importFromY;
    private applyYEvent;
    private writeToY;
}
