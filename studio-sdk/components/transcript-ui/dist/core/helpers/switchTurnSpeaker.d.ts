import { Core } from '../types';
/** Point a turn at another speaker, in every translation that carries the
 *  turn (translations of a channel share turn ids). */
export declare function switchTurnSpeaker(core: Core, turnId: string, newSpeakerId: string): void;
