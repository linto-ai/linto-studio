import { Turn } from '../types/editor';
/** A turn's editable plain text: the words joined by single spaces (the
 *  normalized whitespace contract shared with the server), or the raw text
 *  for words-less turns. */
export declare function computeTurnPlainText(turn: Turn): string;
