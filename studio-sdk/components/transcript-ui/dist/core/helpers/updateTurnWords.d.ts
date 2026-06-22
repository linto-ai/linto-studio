import { Turn, Word } from '../../types/editor';
export declare function updateTurnWords(turns: Turn[], turnId: string, words: Word[]): {
    turns: Turn[];
    updated: Turn;
} | null;
