import { Ref } from 'vue';
import { Turn, Speaker } from '../types/editor';
export interface UseAudioPlayerOptions {
    containerRef: Ref<HTMLElement | null>;
    audioSrc: Ref<string | undefined>;
    turns: Ref<Turn[]>;
    speakers: Ref<Map<string, Speaker>>;
}
export declare function useAudioPlayer(options: UseAudioPlayerOptions): {
    currentTime: Ref<number, number>;
    duration: Ref<number, number>;
    isPlaying: Ref<boolean, boolean>;
    isReady: Ref<boolean, boolean>;
    isLoading: Ref<boolean, boolean>;
    volume: Ref<number, number>;
    playbackRate: Ref<number, number>;
    isMuted: Ref<boolean, boolean>;
    formattedCurrentTime: import('vue').ComputedRef<string>;
    formattedDuration: import('vue').ComputedRef<string>;
    play: () => void;
    pause: () => void;
    togglePlay: () => void;
    seekTo: (time: number) => void;
    skip: (seconds: number) => void;
    setVolume: (v: number) => void;
    setPlaybackRate: (rate: number) => void;
    cyclePlaybackRate: () => void;
    toggleMute: () => void;
};
