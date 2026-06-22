import { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { Turn } from '../../../types/editor';
/**
 * Convert a single ProseMirror "turn" node into a Turn.
 * Only the text + attributes are extracted — words/timestamps live outside
 * ProseMirror and must be merged from backend metadata separately.
 */
export declare function nodeToTurn(node: ProseMirrorNode): Turn;
