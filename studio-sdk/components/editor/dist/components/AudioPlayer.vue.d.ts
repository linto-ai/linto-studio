import { Turn, Speaker } from '../types/editor';
type __VLS_Props = {
    audioSrc?: string;
    turns: Turn[];
    speakers: Map<string, Speaker>;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {
    seekTo: (time: number) => void;
    pause: () => void;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    timeupdate: (time: number) => any;
    playStateChange: (playing: boolean) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onTimeupdate?: ((time: number) => any) | undefined;
    onPlayStateChange?: ((playing: boolean) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    waveformRef: HTMLDivElement;
}, HTMLElement>;
export default _default;
