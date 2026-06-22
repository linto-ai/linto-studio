import { Channel } from '../../types/editor';
import { ChannelStore, CoreEventMap } from '../types';
type Emit = <K extends keyof CoreEventMap>(event: K, payload: CoreEventMap[K]) => void;
type On = <K extends keyof CoreEventMap>(event: K, handler: (payload: CoreEventMap[K]) => void) => () => void;
type SpeakersEnsure = (speakerId: string | null, name?: string) => void;
export declare function createChannelStore(channel: Channel, emit: Emit, on: On, speakersEnsure: SpeakersEnsure): ChannelStore;
export {};
