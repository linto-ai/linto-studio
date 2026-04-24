import { Editor } from '@tiptap/vue-3';
import { Core } from '../../../core/types';
export interface RenameSpeakerOrigin {
    type: "speaker:rename";
    speakerId: string;
    from: string;
    to: string;
}
export interface ReassignTurnOrigin {
    type: "turn:reassign";
    turnId: string;
    from: string | null;
    to: string;
}
export interface CreateAndAssignOrigin {
    type: "speaker:create-and-assign";
    speakerId: string;
    name: string;
    turnId: string;
}
export interface MergeSpeakersOrigin {
    type: "speaker:merge";
    from: string;
    to: string;
    affectedTurnIds: string[];
}
export type SpeakerActionOrigin = RenameSpeakerOrigin | ReassignTurnOrigin | CreateAndAssignOrigin | MergeSpeakersOrigin;
export declare function countTurnsForSpeaker(editor: Editor, speakerId: string): number;
export declare function renameSpeaker(core: Core, speakerId: string, newName: string): void;
export declare function switchTurnSpeaker(core: Core, turnId: string, newSpeakerId: string): void;
export declare function createSpeakerAndAssign(core: Core, turnId: string, name: string): string | null;
export declare function mergeSpeakers(core: Core, fromSpeakerId: string, toSpeakerId: string): void;
