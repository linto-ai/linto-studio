import { Word } from '../../types/editor';
export interface TimedText {
    text: string;
    startTime?: number;
    endTime?: number;
    confidence?: number;
}
/**
 * Lay timed source words out as store Words matching the doc text EXACTLY.
 * The seed (client and server turnsToDoc alike) joins tokens with single
 * spaces and collapses all whitespace — so a stored word carrying irregular
 * whitespace (NBSP, internal space: "l'enfant ?") is SPLIT into its tokens
 * here, each keeping the source word's timing. Without this, every offset
 * after such a word would be shifted from the rendered text at load.
 * Empty/whitespace-only source words (silence placeholders) yield nothing.
 */
export declare function layoutWords(turnId: string, source: TimedText[]): Word[];
