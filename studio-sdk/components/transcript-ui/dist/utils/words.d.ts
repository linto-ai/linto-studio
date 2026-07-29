import { Word } from '../types/editor';
/** True if at least one word carries a timestamp. Robust to sparse timing:
 *  freshly typed words (and split/merge products) may have no timestamp yet,
 *  and they can sit anywhere in the list — not just at index 0. */
export declare function hasWordTimestamps(words: Word[]): boolean;
/** First defined word start in the list (skips untimed leading words). */
export declare function firstWordStart(words: Word[]): number | undefined;
/** Last defined word end in the list (skips untimed trailing words). */
export declare function lastWordEnd(words: Word[]): number | undefined;
/**
 * Returns the first word whose [startTime - margin, endTime] interval contains
 * `time`, or null when none does. Words without timestamps are skipped (a typed
 * word with no timing yet is never "active").
 */
export declare function findActiveWord(words: Word[], time: number): string | null;
