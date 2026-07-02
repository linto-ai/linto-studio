import { Mark } from '@tiptap/core';
/**
 * Inline mark carrying a word's identity (wid) inside the Y.Doc.
 *
 * Word identity now lives IN the document: each spoken word is a text node
 * wearing this mark, separated by unmarked whitespace. The server reads the
 * mark to map words by wid (no more text-diff guessing); timestamps stay out
 * of the doc (server-authoritative, keyed by wid).
 *
 * `inclusive` so typing inside/at the edge of a word keeps its wid (an edit,
 * not a new word). Attributes MUST be identical to the server-side wordMark.js.
 */
export declare const WordMark: Mark<any, any>;
