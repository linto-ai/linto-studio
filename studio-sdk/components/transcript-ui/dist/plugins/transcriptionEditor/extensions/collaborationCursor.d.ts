import { Extension } from '@tiptap/core';
import { Awareness } from 'y-protocols/awareness';
export interface CollaborationCursorOptions {
    awareness: Awareness;
    user: Record<string, unknown>;
}
export declare const CollaborationCursor: Extension<CollaborationCursorOptions, any>;
