import { TranscriptionEditorLockPayload, TranscriptionEditorOptions } from '../types';
/** Committing an emptied turn: delete (requires the lock server-side),
 *  THEN release it — same ordering rule as save/split. */
export declare function pushDeleteThenUnlock(options: TranscriptionEditorOptions, target: TranscriptionEditorLockPayload): Promise<void>;
