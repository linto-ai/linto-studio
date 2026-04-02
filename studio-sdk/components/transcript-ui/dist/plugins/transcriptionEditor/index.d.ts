import { CorePlugin, TranscriptionEditorPluginApi } from '../../core/types';
export type { TranscriptionEditorPluginApi };
export declare function createTranscriptionEditorPlugin(): CorePlugin;
export { TranscriptionDocument } from './extensions/transcriptionDocument';
export { TurnNode } from './extensions/turnNode';
export type { TurnNodeAttributes } from './extensions/turnNode';
export { StoreSync, withSuppressedSync } from './extensions/storeSync';
export { turnsToDoc } from './utils/turnsToDoc';
export { docToTurns } from './utils/docToTurns';
