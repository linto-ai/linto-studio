import { EditorEventMap, SpeakersStore } from '../types';
type Emit = <K extends keyof EditorEventMap>(event: K, payload: EditorEventMap[K]) => void;
export declare function createSpeakersStore(emit: Emit): SpeakersStore & {
    clear(): void;
};
export {};
