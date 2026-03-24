import { Channel } from '../../types/editor';
import { ChannelStore, EditorEventMap } from '../types';
type Emit = <K extends keyof EditorEventMap>(event: K, payload: EditorEventMap[K]) => void;
type SpeakersEnsure = (speakerId: string | null, name?: string) => void;
export declare function createChannelStore(channel: Channel, emit: Emit, speakersEnsure: SpeakersEnsure): ChannelStore;
export {};
