import { Channel } from '../../types/editor';
import { ChannelStore, CoreEventMap } from '../types';
type Emit = <K extends keyof CoreEventMap>(event: K, payload: CoreEventMap[K]) => void;
type SpeakersEnsure = (speakerId: string | null, name?: string) => void;
export declare function createChannelStore(channel: Channel, emit: Emit, speakersEnsure: SpeakersEnsure): ChannelStore;
export {};
