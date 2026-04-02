import { CoreEventMap, SpeakersStore } from '../types';
type Emit = <K extends keyof CoreEventMap>(event: K, payload: CoreEventMap[K]) => void;
export declare function createSpeakersStore(emit: Emit): SpeakersStore & {
    clear(): void;
};
export {};
