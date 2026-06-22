import { Extension } from '@tiptap/core';
import { EditorState } from '@tiptap/pm/state';
import { Core } from '../../../core/types';
export declare function isEditing(state: EditorState): boolean;
export interface WordHighlightOptions {
    core: Core;
}
export declare const WordHighlight: Extension<WordHighlightOptions, any>;
