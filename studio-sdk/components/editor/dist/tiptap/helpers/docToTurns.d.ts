import { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { Turn } from '../../types/editor';
/**
 * Extract Turn[] from a ProseMirror document.
 * Only extracts the text + attributes — words/timestamps are NOT in ProseMirror,
 * they must be merged separately from the backend metadata.
 */
export declare function docToTurns(doc: ProseMirrorNode): Turn[];
