import { Core } from '../../../core/types';
/**
 * Drop a speaker from the GLOBAL store only when no LOADED track still
 * references it. The server GC is per-track (per child conversation); the
 * client store spans the whole document — a speaker id shared across tracks
 * must survive its removal from one of them.
 */
export declare function removeSpeakerIfUnused(core: Core, speakerId: string): void;
