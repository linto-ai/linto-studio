import { Turn } from '../../../types/editor';
/**
 * Merge a freshly-extracted turn with the stored one, keeping the stored words
 * (= timestamps) when the text is unchanged.
 *
 * Compare whitespace-normalized, ignoring empty placeholder words: the doc text
 * never contains them, while stored words do — a raw join would see a phantom
 * difference and drop the words (= timestamps) on unrelated edits.
 */
export declare function mergeTurnPreservingWords(newTurn: Turn, oldTurn: Turn | undefined): Turn;
