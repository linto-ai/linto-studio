import { EditorDocument } from '../types/editor';
export declare class DocumentValidationError extends Error {
    path: string;
    constructor(path: string, message: string);
}
export declare function validateEditorDocument(doc: unknown): asserts doc is EditorDocument;
