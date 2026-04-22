import { CorePlugin, AudioPluginApi } from '../../core/types';
import { AudioSource } from '../../types/editor';
export type { AudioPluginApi };
export interface AudioPluginOptions {
    /**
     * Résout une `AudioSource` en URL jouable. Permet à l'hôte d'ajouter un
     * bearer token, de fetch en blob puis `URL.createObjectURL`, etc.
     * Si absent, `source.src` est utilisé tel quel.
     *
     * Toute URL `blob:` retournée est révoquée automatiquement au changement
     * de source ou au destroy du plugin.
     */
    resolveSrc?: (source: AudioSource) => string | Promise<string>;
}
export declare function createAudioPlugin(options?: AudioPluginOptions): CorePlugin;
