import { ApiDocument, ApiWord } from '../types/api';
import { EditorDocument, Word } from '../types/editor';
export declare function mapWord(w: ApiWord): Word;
export declare function mapApiDocument(raw: ApiDocument): EditorDocument;
