import { Ref } from 'vue';
export declare function useFollowPlayback(scrollContainer: Readonly<Ref<HTMLElement | null | undefined>>): {
    isFollowing: Ref<boolean, boolean>;
    resumeFollow: () => void;
};
