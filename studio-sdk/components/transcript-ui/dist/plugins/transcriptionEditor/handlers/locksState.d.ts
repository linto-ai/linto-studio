import { TurnLock } from '../../../core/types';
import { EditorPluginState, TranscriptionEditorLockPayload } from '../types';
/** Lock held on a turn of the ACTIVE translation, if any. */
export declare function getTurnLock(state: EditorPluginState, turnId: string): {
    userId: string;
    userName: string;
} | undefined;
/** Full replacement — join ack and reconnection re-ack. */
export declare function setLocks(state: EditorPluginState, all: TurnLock[]): void;
export declare function setTurnLock(state: EditorPluginState, lock: TurnLock): void;
export declare function clearTurnLock(state: EditorPluginState, ref: TranscriptionEditorLockPayload): void;
