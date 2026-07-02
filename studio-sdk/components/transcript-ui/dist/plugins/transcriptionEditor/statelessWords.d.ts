import { TranslationStore } from '../../core/types';
/**
 * Timestamps live outside the Y.Doc (which carries word identity + text) and
 * travel through Hocuspocus stateless messages: the client sends
 * REQUEST_WORDS_MESSAGE, the server answers with `timestamps_recalc` chunks
 * keyed by wid.
 */
export declare const REQUEST_WORDS_MESSAGE: string;
/** Apply a `timestamps_recalc` payload to the translation store. Unknown or
 *  malformed payloads are ignored. */
export declare function applyStatelessPayload(payload: string, translation: TranslationStore): void;
