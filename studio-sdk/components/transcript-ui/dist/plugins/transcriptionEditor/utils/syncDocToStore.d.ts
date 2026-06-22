import { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { Core, TranslationStore } from '../../../core/types';
/**
 * Mirror a ProseMirror document change into the translation store.
 *
 * Fast path (equal child count, same ids in place): edit only the changed turns
 * in place. Fallback (a turn was added/removed/reordered): rebuild the store
 * array in document order so every consumer that reads turns.value positionally
 * stays aligned with the PM/Yjs doc.
 */
export declare function syncDocToStore(newDoc: ProseMirrorNode, oldDoc: ProseMirrorNode, translation: TranslationStore, store: Core): void;
