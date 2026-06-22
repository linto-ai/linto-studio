import { Editor } from '@tiptap/vue-3';
import { Doc } from 'yjs';
import { Awareness } from 'y-protocols/awareness';
import { Core, TranslationStore } from '../../core/types';
export interface TiptapEditorConfig {
    core: Core;
    ydoc: Doc;
    field: string;
    /** The session's translation — fixed for the editor's lifetime. */
    translation: TranslationStore;
    readOnly: boolean;
    /** Remote cursors; null in local mode. */
    awareness: Awareness | null;
    user: {
        name: string;
        color: string;
        [key: string]: unknown;
    };
}
/** Assemble a Tiptap editor bound to a Y.Doc. Pure factory: the caller owns
 *  the returned editor and must destroy() it. */
export declare function createTiptapEditor(config: TiptapEditorConfig): Editor;
