import { Word } from '../../types/editor';
/** Derive the word list from a turn's plain text (no timestamps — those are
 *  carried over or broadcast by the server). */
export declare function wordsFromText(turnId: string, text: string): Word[];
