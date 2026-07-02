import { Turn } from '../../../types/editor';
/** Comparison of the fields storeSync mirrors between PM and the store. Words
 *  are compared element-wise (id + text): for a word turn `text` is null on both
 *  sides, so a same-count in-word edit (typo fix, split/merge keeping the count)
 *  would otherwise look unchanged and never reach the store. */
export declare function hasTurnChanged(a: Turn, b: Turn): boolean;
