import { Node } from '@tiptap/core';
export interface TurnNodeAttributes {
    id: string;
    speakerId: string | null;
    startTime: number | undefined;
    endTime: number | undefined;
    startDate: number | undefined;
    endDate: number | undefined;
    language: string;
}
export declare const TurnNode: Node<any, any>;
