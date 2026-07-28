import { Core } from '../types';
/** Reassign every turn of the merged-away speaker to the surviving one, then
 *  drop the merged-away speaker — in that order, so no turn ever references a
 *  removed speaker. */
export declare function mergeSpeakers(core: Core, fromSpeakerId: string, toSpeakerId: string): void;
