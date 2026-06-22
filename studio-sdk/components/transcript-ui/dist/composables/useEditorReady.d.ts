import { Ref } from 'vue';
import { Core } from '../core/types';
export interface EditorReady {
    /** True while the editor is loading its first (or a freshly reloaded) document. */
    isLoading: Ref<boolean>;
    /** Non-null when the editor failed to load (mirrors the plugin error). */
    error: Ref<string | null>;
}
/**
 * Owns the editor's loading state so embedders don't have to poll the
 * cross-runtime sync ref themselves.
 *
 * The overlay shows until the editor can display content:
 *  - a document must be loaded (channels populated), and
 *  - in collaborative mode, the first server sync must have completed.
 *
 * Loading a new document (`document:change`, e.g. an epoch reload) shows the
 * overlay again; transient mid-session reconnections do not — `isConnected`
 * flips on every disconnect, so we only react until the first sync of a load.
 * A timeout guarantees the overlay is eventually cleared.
 */
export declare function useEditorReady(core: Core): EditorReady;
