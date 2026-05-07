import { WatermarkToken } from '../../../core/types';
export type WatermarkPart = {
    type: "text";
    value: string;
} | {
    type: "token";
    src: string;
    alt: string;
};
export declare function parseWatermark(content: string, tokens: Record<string, WatermarkToken>): WatermarkPart[];
