import { EditorPluginState } from '../types';
/**
 * Version gate for an incoming broadcast: should it be applied?
 *  - untracked track (not loaded yet) or unversioned broadcast → apply
 *    (the other guards handle it — legacy behavior);
 *  - version ≤ known → already part of the loaded content, skip;
 *  - version = known + 1 → the nominal case: advance and apply;
 *  - version jump → broadcasts were missed: skip and refetch the track
 *    (the reload carries the whole truth, replaying is pointless).
 */
export declare function trackBroadcastVersion(state: EditorPluginState, translationId: string, version: number | undefined): boolean;
/** Ask the host to reload a track — once, even under a broadcast burst. */
export declare function requestRefetch(state: EditorPluginState, translationId: string): void;
