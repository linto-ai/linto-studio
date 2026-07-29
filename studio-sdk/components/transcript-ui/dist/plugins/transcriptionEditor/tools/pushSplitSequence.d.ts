import { TranscriptionEditorOptions } from '../types';
/**
 * The Enter gesture's network sequence: save (when the text changed), THEN
 * split, THEN unlock — each step requires the previous one:
 *  - the split offset targets the SAVED text, so a failed save aborts the
 *    split (the server would cut the old text at the new text's offset);
 *  - both mutations require the lock, so the unlock always comes last.
 */
export declare function pushSplitSequence(options: TranscriptionEditorOptions, payload: {
    translationId: string;
    turnId: string;
    text: string;
    offset: number;
    textChanged: boolean;
}): Promise<void>;
