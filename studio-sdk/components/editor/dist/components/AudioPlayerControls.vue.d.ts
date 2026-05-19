type __VLS_Props = {
    isPlaying: boolean;
    currentTime: string;
    duration: string;
    volume: number;
    playbackRate: number;
    isMuted: boolean;
    isReady: boolean;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    togglePlay: () => any;
    skipBack: () => any;
    skipForward: () => any;
    "update:volume": (value: number) => any;
    toggleMute: () => any;
    cyclePlaybackRate: () => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onTogglePlay?: (() => any) | undefined;
    onSkipBack?: (() => any) | undefined;
    onSkipForward?: (() => any) | undefined;
    "onUpdate:volume"?: ((value: number) => any) | undefined;
    onToggleMute?: (() => any) | undefined;
    onCyclePlaybackRate?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export default _default;
