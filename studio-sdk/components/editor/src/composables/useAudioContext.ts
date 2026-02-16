import {
  inject,
  provide,
  type DeepReadonly,
  type InjectionKey,
  type Ref,
} from 'vue'

export interface AudioContext {
  currentTime: DeepReadonly<Ref<number>>
  isPlaying: DeepReadonly<Ref<boolean>>
  seekTo: (time: number) => void
}

const audioContextKey: InjectionKey<AudioContext> = Symbol('audioContext')

export function provideAudioContext(context: AudioContext): void {
  provide(audioContextKey, context)
}

export function useAudioContext(): AudioContext | null {
  return inject(audioContextKey, null)
}
