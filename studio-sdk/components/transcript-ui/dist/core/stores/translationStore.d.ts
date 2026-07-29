import { AudioSource, Turn } from '../../types/editor';
import { CoreEventMap, TranslationInfo, TranslationStore } from '../types';
interface TranslationInit extends TranslationInfo {
    audio?: AudioSource;
    turns: Turn[];
}
type Emit = <K extends keyof CoreEventMap>(event: K, payload: CoreEventMap[K]) => void;
type SpeakersEnsure = (speakerId: string | null, name?: string) => void;
export declare function createTranslationStore(init: TranslationInit, emit: Emit, speakersEnsure: SpeakersEnsure): TranslationStore;
export {};
