import { Ref } from 'vue';
import { Turn } from '../types/editor';
export declare function useFollowPlayback(scrollContainer: Readonly<Ref<HTMLElement | null | undefined>>, turns: Ref<Turn[]>): {
    isFollowing: Ref<boolean, boolean>;
    activeTurnId: import('vue').ComputedRef<string | null>;
    resumeFollow: () => void;
};
