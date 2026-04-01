import { Extension } from '@tiptap/core';
import { EditorStore, TranslationStore } from '../../../core/types';
export declare function withSuppressedSync(fn: () => void): void;
export interface StoreSyncOptions {
    store: EditorStore;
    getTranslation: () => TranslationStore | undefined;
}
export declare const StoreSync: Extension<StoreSyncOptions, any>;
