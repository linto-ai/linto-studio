export declare function createAudioPlayback(): {
    currentTime: import('vue').Ref<number, number>;
    isPlaying: import('vue').Ref<boolean, boolean>;
    seekTo: (time: number) => void;
    setSeekHandler: (fn: ((time: number) => void) | null) => void;
};
