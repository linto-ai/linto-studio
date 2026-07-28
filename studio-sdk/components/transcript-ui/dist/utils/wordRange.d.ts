import { Core } from '../core/types';
import { Turn } from '../types/editor';
/**
 * Locate a word in the rendered DOM as a character Range — the shared anchor
 * for the karaoke highlight (CSS Custom Highlight API) and follow-playback
 * scrolling. Nothing is ever inserted into the content: a Range is a
 * read-only view over the existing text nodes.
 */
/** Resolve the active word id (`turnId#index`) into a DOM Range under `root`
 *  (the editor DOM or any container holding the rendered turns). */
export declare function activeWordRange(root: ParentNode, core: Core, wordId: string): Range | null;
export declare function findWordRange(root: ParentNode, turn: Turn, index: number): Range | null;
