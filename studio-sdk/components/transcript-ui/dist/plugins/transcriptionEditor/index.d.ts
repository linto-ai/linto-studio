import { Ref } from 'vue';
import { Doc } from 'yjs';
import { Awareness } from 'y-protocols/awareness';
import { CorePlugin, TranscriptionEditorPluginApi } from '../../core/types';
export type { TranscriptionEditorPluginApi };
export interface TranscriptionEditorOptions {
    /** Existing Y.Doc (collaborative mode). If absent, a local Y.Doc is created. */
    document?: Doc;
    /** Awareness instance for collaborative cursors (optional). */
    awareness?: Awareness;
    /** Name of the XmlFragment in the Y.Doc. @default "default" */
    field?: string;
    /** Local user info for cursor display. */
    user?: {
        name: string;
        color: string;
        [key: string]: unknown;
    };
    /** Reactive boolean ref managed by the provider for connection status. */
    isConnected?: Ref<boolean>;
}
export declare function createTranscriptionEditorPlugin(options?: TranscriptionEditorOptions): CorePlugin;
export { TranscriptionDocument } from './extensions/transcriptionDocument';
export { TurnNode } from './extensions/turnNode';
export type { TurnNodeAttributes } from './extensions/turnNode';
export { StoreSync, withSuppressedSync } from './extensions/storeSync';
export { CollaborationCursor } from './extensions/collaborationCursor';
export { turnsToDoc } from './utils/turnsToDoc';
export { docToTurns } from './utils/docToTurns';
