import { CorePlugin, TranscriptionEditorPluginApi } from '../../core/types';
import { CollabOptions, LocalUser } from './session';
export type { TranscriptionEditorPluginApi };
export type { CollabOptions };
export interface TranscriptionEditorOptions {
    /** Collaborative mode configuration. If absent, local-only mode. */
    collab?: CollabOptions;
    /** Name of the XmlFragment in the Y.Doc. @default "default" */
    field?: string;
    /** Local user info for cursor display. */
    user?: LocalUser;
    /**
     * Read-only mode: the editor is not editable and broadcasts no cursor or
     * selection to other participants. Remote edits are still received, so the
     * user keeps seeing others work. @default false
     */
    readOnly?: boolean;
}
export declare function createTranscriptionEditorPlugin({ collab, field, user, readOnly, }?: TranscriptionEditorOptions): CorePlugin;
export { TranscriptionDocument } from './extensions/transcriptionDocument';
export { TurnNode } from './extensions/turnNode';
export type { TurnNodeAttributes } from './extensions/turnNode';
export { StoreSync, withSuppressedSync } from './extensions/storeSync';
export { CollaborationCursor } from './extensions/collaborationCursor';
export { turnsToDoc } from './utils/turnsToDoc';
export { docToTurns } from './utils/docToTurns';
