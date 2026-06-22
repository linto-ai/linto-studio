import { CorePlugin, AudioPluginApi } from '../../core/types';
import { AudioSource } from '../../types/editor';
export type { AudioPluginApi };
export interface AudioPluginOptions {
    /**
     * Resolves an `AudioSource` into a playable URL. Lets the host add a
     * bearer token, fetch as a blob then `URL.createObjectURL`, etc.
     * When absent, `source.src` is used as is.
     *
     * Any returned `blob:` URL is revoked automatically when the source
     * changes or the plugin is destroyed.
     */
    resolveSrc?: (source: AudioSource) => string | Promise<string>;
    /**
     * Resolves precomputed waveform peaks for an `AudioSource` (e.g. fetched
     * from the API). Raw amplitude values, any scale — the player normalizes
     * them. Return null (or throw) to fall back to client-side decoding.
     */
    resolveWaveform?: (source: AudioSource) => number[] | null | Promise<number[] | null>;
}
export declare function createAudioPlugin(options?: AudioPluginOptions): CorePlugin;
