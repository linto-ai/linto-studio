import { Turn } from '../../../types/editor';
import { JSONContent } from '@tiptap/core';
/** Convert a Turn[] array into TipTap-compatible JSON content */
export declare function turnsToDoc(turns: Turn[]): JSONContent;
