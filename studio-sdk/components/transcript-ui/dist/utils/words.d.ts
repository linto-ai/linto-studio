import { Word } from '../types/editor';
export declare function hasWordTimestamps(words: Word[]): boolean;
/**
 * Renvoie le dernier mot dont l'intervalle [startTime - margin, endTime + margin]
 * contient `time`. Renvoie null si aucun mot n'est à moins de `ACTIVE_WORD_MARGIN`
 * secondes du temps courant.
 */
export declare function findActiveWord(words: Word[], time: number): string | null;
