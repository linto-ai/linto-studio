import { Word } from '../types/editor';
/** The word whose [charStart, charEnd) range contains the offset, if any —
 *  words without offsets (defensive) never match. */
export declare function findWordAtOffset(words: Word[], offset: number): Word | undefined;
