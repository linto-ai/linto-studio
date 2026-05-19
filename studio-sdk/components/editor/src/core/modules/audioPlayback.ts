import { ref } from "vue"

export function createAudioPlayback() {
  const currentTime = ref(0)
  const isPlaying = ref(false)
  let seekHandler: ((time: number) => void) | null = null

  function seekTo(time: number) {
    seekHandler?.(time)
  }

  function setSeekHandler(fn: ((time: number) => void) | null) {
    seekHandler = fn
  }

  return { currentTime, isPlaying, seekTo, setSeekHandler }
}
