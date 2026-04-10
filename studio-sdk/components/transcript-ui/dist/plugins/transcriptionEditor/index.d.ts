import { CorePlugin, TranscriptionEditorPluginApi } from '../../core/types';
export type { TranscriptionEditorPluginApi };
export interface CollabOptions {
    /** Hocuspocus WebSocket URL (e.g. "ws://localhost/ws/editor") */
    url: string;
    /** JWT token for authentication */
    token: string;
}
export interface TranscriptionEditorOptions {
    /** Collaborative mode configuration. If absent, local-only mode. */
    collab?: CollabOptions;
    /** Name of the XmlFragment in the Y.Doc. @default "default" */
    field?: string;
    /** Local user info for cursor display. */
    user?: {
        name: string;
        color: string;
        [key: string]: unknown;
    };
}
export declare function createTranscriptionEditorPlugin(options?: TranscriptionEditorOptions): CorePlugin;
export { TranscriptionDocument } from './extensions/transcriptionDocument';
export { TurnNode } from './extensions/turnNode';
export type { TurnNodeAttributes } from './extensions/turnNode';
export { StoreSync, withSuppressedSync } from './extensions/storeSync';
export { CollaborationCursor } from './extensions/collaborationCursor';
export { turnsToDoc } from './utils/turnsToDoc';
export { docToTurns } from './utils/docToTurns';
