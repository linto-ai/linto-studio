import { TranscriptionEditorOptions, TranscriptionEditorSavePayload } from '../types';
/**
 * Push the save, THEN release the lock. The order is mandatory: update_turn
 * requires the lock server-side — an unlock racing ahead of the save ack
 * would get the save refused (not_lock_owner). A failed save still unlocks
 * (a ghost lock would linger for the whole TTL otherwise).
 */
export declare function pushSaveThenUnlock(options: TranscriptionEditorOptions, payload: TranscriptionEditorSavePayload): Promise<void>;
