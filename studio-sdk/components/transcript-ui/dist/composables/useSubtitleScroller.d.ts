import { ComputedRef, Ref } from 'vue';
interface UseSubtitleScrollerOptions {
    canvasRef: Readonly<Ref<HTMLCanvasElement | null>>;
    fontSize: Ref<number> | ComputedRef<number>;
    lineHeight: Ref<number> | ComputedRef<number>;
}
/**
 * Wires a SubtitleScroller to editor events (live partials, turn adds, sync resets).
 * Handles creation on mount and full cleanup on unmount.
 */
export declare function useSubtitleScroller(options: UseSubtitleScrollerOptions): void;
export {};
