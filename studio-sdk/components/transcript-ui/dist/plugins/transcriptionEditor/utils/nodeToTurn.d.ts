import { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { Turn } from '../../../types/editor';
/**
 * Convert a single ProseMirror "turn" node into a Turn.
 *
 * Word IDENTITY is read from the inline `word` mark on each text node (wid →
 * Word.id); timestamps are NOT in the doc — they are merged in separately, by
 * wid, from the server (mergeTurnPreservingWords for locally-known words,
 * applyStatelessPayload for freshly recomputed ones).
 */
export declare function nodeToTurn(node: ProseMirrorNode): Turn;
