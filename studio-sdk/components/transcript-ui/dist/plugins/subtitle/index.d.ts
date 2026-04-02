import { CorePlugin, SubtitlePluginApi } from '../../core/types';
export type { SubtitlePluginApi };
export interface SubtitlePluginOptions {
    fontSize?: number;
}
export declare function createSubtitlePlugin(options?: SubtitlePluginOptions): CorePlugin;
