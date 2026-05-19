import { Speaker } from '../../types/editor';
export declare function updateSpeaker(speakers: Map<string, Speaker>, speakerId: string, patch: Partial<Omit<Speaker, "id">>): Speaker | null;
