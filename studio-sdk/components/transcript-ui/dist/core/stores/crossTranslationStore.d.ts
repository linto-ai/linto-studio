import { CoreEventMap, ReadableTranslation, TranslationStore } from '../types';
export declare const CROSS_TRANSLATION_ID = "cross";
type Emit = <K extends keyof CoreEventMap>(event: K, payload: CoreEventMap[K]) => void;
type On = <K extends keyof CoreEventMap>(event: K, handler: (payload: CoreEventMap[K]) => void) => () => void;
export interface CrossTranslationStore extends ReadableTranslation {
    /** Unsubscribe the underlying turn-event relay. */
    dispose(): void;
}
/**
 * Virtual, read-only translation for a bilingual document: each turn is shown
 * in the *other* language. Returns null when not applicable — i.e. the source
 * doesn't have exactly two languages, or a translation track is missing for one
 * of them. Otherwise turn content is composed from the two matching translation
 * tracks (keyed by turnId). Stores nothing — `turns` is a computed.
 *
 * Because the active-translation event scope filters on `translationId`, and the
 * real tracks emit under their own id, this store relays their turn events under
 * `CROSS_TRANSLATION_ID` so that subtitle/scroller listeners fire while cross is
 * active. Call `dispose()` to detach the relay.
 */
export declare function createCrossTranslationStore(source: TranslationStore, translations: Map<string, TranslationStore>, emit: Emit, on: On): CrossTranslationStore | null;
export {};
