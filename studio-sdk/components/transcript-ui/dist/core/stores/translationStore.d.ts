import { AudioSource, Turn } from '../../types/editor';
import { CoreEventMap, TranslationStore } from '../types';
interface TranslationInit {
    id: string;
    languages: string[];
    isSource: boolean;
    audio?: AudioSource;
    turns: Turn[];
}
type Emit = <K extends keyof CoreEventMap>(event: K, payload: CoreEventMap[K]) => void;
type SpeakersEnsure = (speakerId: string | null, name?: string) => void;
export declare function createTranslationStore(init: TranslationInit, emit: Emit, speakersEnsure: SpeakersEnsure): TranslationStore;
export {};
