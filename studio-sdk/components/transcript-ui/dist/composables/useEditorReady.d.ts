import { Ref } from 'vue';
import { Core } from '../core/types';
export interface EditorReady {
    /** True while the editor is loading its first (or a freshly reloaded) document. */
    isLoading: Ref<boolean>;
    /** Non-null when the editor failed to load. */
    error: Ref<string | null>;
}
/**
 * Owns the editor's loading state so embedders don't have to track it.
 *
 * The overlay shows until a document is loaded (channels populated). Loading a
 * new document (`document:change`) resolves it immediately — setDocument is
 * synchronous — so the reset only matters for the initial mount, where the
 * host may set the document long after the component tree is up. A timeout
 * guarantees the overlay is eventually cleared.
 */
export declare function useEditorReady(core: Core): EditorReady;
