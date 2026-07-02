import { Extension } from '@tiptap/core';
import { Core } from '../../../core/types';
export interface WordHighlightOptions {
    core: Core;
}
/**
 * Highlight the word currently being played by injecting a single CSS rule
 * targeting its `[data-wid]` span — NOT a ProseMirror decoration.
 *
 * Each word already renders as `<span data-wid>` (the `word` mark) and wids are
 * globally unique, so a one-line stylesheet `[data-wid="X"]{…}` highlights
 * exactly the active word. This deliberately avoids ProseMirror decorations:
 * an inline decoration over the marked spans raced PM's DOM reconciliation and
 * crashed updateChildren ("can't access property nextSibling, dom is null") on
 * merged/edited turns during playback. Pure CSS never dispatches a transaction
 * and never touches the desc tree, so it cannot trigger that crash.
 */
export declare const WordHighlight: Extension<WordHighlightOptions, any>;
