import { Extension } from '@tiptap/core';
import { Core, TranslationStore } from '../../../core/types';
export declare function withSuppressedSync(fn: () => void): void;
export interface StoreSyncOptions {
    store: Core;
    getTranslation: () => TranslationStore | undefined;
}
export declare const StoreSync: Extension<StoreSyncOptions, any>;
