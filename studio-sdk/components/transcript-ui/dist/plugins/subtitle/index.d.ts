import { CorePlugin, SubtitlePluginApi, WatermarkPluginApi, WatermarkToken } from '../../core/types';
import { default as SubtitleBanner } from './SubtitleBanner.vue';
import { default as SubtitleFullscreen } from './SubtitleFullscreen.vue';
export type { SubtitlePluginApi, WatermarkPluginApi, WatermarkToken };
export { SubtitleBanner, SubtitleFullscreen };
export interface WatermarkOptions {
    display?: boolean;
    pinned?: boolean;
    content?: string;
    frequency?: number;
    duration?: number;
    tokens?: Record<string, WatermarkToken>;
    readonly?: boolean;
}
export interface SubtitlePluginOptions {
    fontSize?: number;
    isVisible?: boolean;
    watermark?: WatermarkOptions;
}
export declare function createSubtitlePlugin(options?: SubtitlePluginOptions): CorePlugin;
