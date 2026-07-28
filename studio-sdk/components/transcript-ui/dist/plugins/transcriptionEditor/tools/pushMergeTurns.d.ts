import { TranscriptionEditorMergePayload, TranscriptionEditorOptions } from '../types';
/** Ask the server to merge — fire-and-forget, the broadcast applies it. */
export declare function pushMergeTurns(options: TranscriptionEditorOptions, payload: TranscriptionEditorMergePayload): Promise<void>;
