import { Doc } from 'yjs';
import { Editor } from '@tiptap/vue-3';
import { Core, TranslationStore, YjsUser } from '../../core/types';
export interface CollabOptions {
    /** Hocuspocus WebSocket URL (e.g. "ws://localhost/ws/editor") */
    url: string;
    /** JWT token for authentication */
    token: string;
    /**
     * Editor epoch per translation id (= conversation id), as fetched from the
     * API. The epoch identifies the server-side CRDT history lineage and is
     * appended to the Hocuspocus document name; the server rejects connections
     * whose epoch is stale (history rebuilt after an external write).
     * Missing entry defaults to 0.
     */
    epochs?: Record<string, number>;
    /**
     * Called when the server rejects the connection at authentication —
     * invalid/expired token, lost access, or stale epoch. For a stale epoch
     * the host should refetch the document (fresh epochs) and reload it.
     */
    onAuthenticationFailed?: (reason: string) => void;
}
export interface LocalUser {
    name: string;
    color: string;
    [key: string]: unknown;
}
/**
 * Plugin-side surface a session publishes its reactive state through.
 * The plugin owns the state (refs stay stable across session restarts);
 * sessions only push into it.
 */
export interface SessionHost {
    setEditor(editor: Editor | undefined): void;
    setConnected(connected: boolean): void;
    setUsers(users: YjsUser[]): void;
    /** Local collaborator identity; plugin-owned so it survives restarts. */
    readonly user: LocalUser;
}
export interface SessionDeps {
    core: Core;
    host: SessionHost;
    /** The editable translation this session is bound to — fixed for its lifetime. */
    translation: TranslationStore;
    field: string;
    readOnly: boolean;
}
/** A session owns the resources bound to one translation: a Y.Doc, an
 *  optional provider, a Tiptap editor. destroy() releases all of them. */
export interface EditorSession {
    readonly ydoc: Doc;
    /** Broadcast the (already updated) host.user to remote participants. */
    updateUser(): void;
    destroy(): void;
}
export declare class CollabSession implements EditorSession {
    readonly ydoc: Doc;
    private readonly deps;
    private readonly provider;
    private editor;
    private speakersSync;
    constructor(deps: SessionDeps, collab: CollabOptions);
    updateUser(): void;
    destroy(): void;
    /** Fires on every (re)sync of the provider, not just the first one. */
    private handleSynced;
    private createEditor;
    /**
     * Words+timestamps live outside the Y.Doc and are served on demand
     * (stateless messages). Request them only once the store holds the turns —
     * requesting earlier would race the doc sync: applyStatelessPayload would
     * find no matching turn and silently drop the payload.
     *
     * The editor is created after the provider sync, so Tiptap builds its
     * initial state from the already-populated Y fragment during construction
     * — no docChanged transaction is dispatched for it (StoreSync fills the
     * store synchronously through the same path). Only an empty doc still
     * needs to wait for a first doc-changing transaction.
     */
    private requestWordsWhenHydrated;
    private requestWords;
}
export declare class LocalSession implements EditorSession {
    readonly ydoc: Doc;
    private readonly editor;
    private readonly speakersSync;
    constructor(deps: SessionDeps);
    updateUser(): void;
    destroy(): void;
}
