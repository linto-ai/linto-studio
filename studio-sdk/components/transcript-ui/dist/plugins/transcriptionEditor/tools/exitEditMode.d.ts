import { EditorPluginState, TranscriptionEditorLockPayload } from '../types';
/**
 * Leave edit mode: clear the editing refs, stop the heartbeat, and drop the
 * own-lock entry now instead of waiting for the turn_unlocked broadcast — an
 * immediate re-click must not hit the local pre-check on a stale own lock.
 * @returns the edit's lock target (for the unlock push), or null.
 */
export declare function exitEditMode(state: EditorPluginState): TranscriptionEditorLockPayload | null;
