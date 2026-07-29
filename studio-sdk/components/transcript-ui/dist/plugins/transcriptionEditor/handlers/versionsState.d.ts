import { EditorPluginState } from '../types';
/** Baseline: the version the track's freshly fetched content corresponds to
 *  (host-pushed together with the content — same backend read). */
export declare function setTranslationVersion(state: EditorPluginState, translationId: string, version: number): void;
/** Reconnection check (join re-ack): refetch every LOADED track the server
 *  says is ahead of what we hold. Unloaded tracks fetch fresh anyway. */
export declare function reconcileVersions(state: EditorPluginState, serverVersions: Record<string, number>): void;
