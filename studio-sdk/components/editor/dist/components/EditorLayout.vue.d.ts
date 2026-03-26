type __VLS_Props = {
    showHeader?: boolean;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    showHeader: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    audioPlayer: import('vue').CreateComponentPublicInstanceWithMixins<Readonly<{
        audioSrc?: string;
        turns: import('..').Turn[];
        speakers: Map<string, import('..').Speaker>;
    }> & Readonly<{
        onTimeupdate?: ((time: number) => any) | undefined;
        onPlayStateChange?: ((playing: boolean) => any) | undefined;
    }>, {
        seekTo: (time: number) => void;
        pause: () => void;
    }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
        timeupdate: (time: number) => any;
        playStateChange: (playing: boolean) => any;
    }, import('vue').PublicProps, {}, false, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {
        waveformRef: HTMLDivElement;
    }, HTMLElement, import('vue').ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<{
        audioSrc?: string;
        turns: import('..').Turn[];
        speakers: Map<string, import('..').Speaker>;
    }> & Readonly<{
        onTimeupdate?: ((time: number) => any) | undefined;
        onPlayStateChange?: ((playing: boolean) => any) | undefined;
    }>, {
        seekTo: (time: number) => void;
        pause: () => void;
    }, {}, {}, {}, {}> | null;
}, HTMLDivElement>;
export default _default;
