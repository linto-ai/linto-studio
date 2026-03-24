import { DeepReadonly, Ref } from 'vue';
interface UseAutoScrollOptions {
    panelRef: Ref<HTMLElement | null>;
    isPrepending?: Ref<boolean>;
}
interface UseAutoScrollReturn {
    isFollowing: DeepReadonly<Ref<boolean>>;
    resumeFollow: () => void;
}
export declare function useAutoScroll({ panelRef, isPrepending, }: UseAutoScrollOptions): UseAutoScrollReturn;
export {};
