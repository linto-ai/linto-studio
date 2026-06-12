import { EditorPlugin, SubtitlePluginApi, WatermarkPluginApi, WatermarkToken } from '../../core/types';
export type { SubtitlePluginApi, WatermarkPluginApi, WatermarkToken };
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
export declare function createSubtitlePlugin(options?: SubtitlePluginOptions): EditorPlugin;
