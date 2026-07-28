import { ApiTurn } from '../types/api';
import { Turn } from '../types/editor';
/**
 * Map backend turns (one translation's `text` array) onto editor Turns.
 *
 * This is where the editor's input invariants are enforced — positional word
 * identity (`turnId#index`), offsets on the single-space layout shared with
 * the server, silence placeholders dropped, wire wid ignored. Embedders fetch
 * and assemble the document topology themselves, but the per-turn mapping
 * must go through here.
 */
export declare function mapApiTurns(apiTurns: ApiTurn[]): Turn[];
