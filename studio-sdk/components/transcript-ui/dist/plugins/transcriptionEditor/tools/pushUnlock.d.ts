import { TranscriptionEditorLockPayload, TranscriptionEditorOptions } from '../types';
/** Release the server lock — fire-and-forget from the UI's perspective. */
export declare function pushUnlock(options: TranscriptionEditorOptions, target: TranscriptionEditorLockPayload): Promise<void>;
