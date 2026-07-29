import { CorePlugin } from '../../core/types';
import { TranscriptionEditorOptions } from './types';
export type { TranscriptionEditorOptions, TranscriptionEditorSavePayload, TranscriptionEditorLockPayload, } from './types';
/**
 * Per-turn plain-text editing (the lock+save model — see the "Editor v2"
 * design). One turn is edited at a time; entering edit mode acquires a
 * server-side lock, leaving it (save/cancel) releases it. Without host
 * handlers the plugin runs local-only (dev harness, viewer).
 */
export declare function createTranscriptionEditorPlugin(options?: TranscriptionEditorOptions): CorePlugin;
