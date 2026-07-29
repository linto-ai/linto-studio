import { Word } from '../../types/editor';
import { ApiWord } from '../../types/api';
/** Build the word list from an API turn payload (see layoutWords). */
export declare function wordsFromApi(turnId: string, apiWords: ApiWord[]): Word[];
