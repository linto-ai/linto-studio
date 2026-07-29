import { Core, TranslationStore } from '../../../core/types';
/** The edited text belongs to ONE language track: the active translation
 *  (cross mode has no mutable store and is not editable). */
export declare function getActiveTranslationStore(core: Core): TranslationStore | undefined;
