import { Word } from '../types/editor';
export declare function hasWordTimestamps(words: Word[]): boolean;
/**
 * Returns the last word whose [startTime - margin, endTime + margin]
 * interval contains `time`, or null when no word is within
 * `ACTIVE_WORD_MARGIN` seconds of the current time.
 */
export declare function findActiveWord(words: Word[], time: number): string | null;
