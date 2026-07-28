import { Core } from '../types';
/** Number of turns assigned to a speaker in the active translation — what the
 *  user currently sees (merge dialog, speaker menus). */
export declare function countTurnsForSpeaker(core: Core, speakerId: string): number;
