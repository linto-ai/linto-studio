import { Core, TranslationStore } from '../../../core/types';
/** A translation store by id, across every channel — server broadcasts may
 *  target a track the user is not looking at. */
export declare function findTranslationStore(core: Core, translationId: string): TranslationStore | undefined;
