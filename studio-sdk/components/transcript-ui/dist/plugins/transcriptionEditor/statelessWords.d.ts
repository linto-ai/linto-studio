import { TranslationStore } from '../../core/types';
/**
 * Words+timestamps live outside the Y.Doc (which carries segments only) and
 * travel through Hocuspocus stateless messages: the client sends
 * REQUEST_WORDS_MESSAGE, the server answers with `timestamps_recalc` chunks.
 */
export declare const REQUEST_WORDS_MESSAGE: string;
/** Apply a `timestamps_recalc` payload to the translation store. Unknown or
 *  malformed payloads are ignored. */
export declare function applyStatelessPayload(payload: string, translation: TranslationStore): void;
