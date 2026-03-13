import { ref, computed } from "vue"
import type { EditorCore, EditorPlugin, AudioPluginApi } from "../../core/types"

export type { AudioPluginApi }

export function createAudioPlugin(): EditorPlugin {
  return {
    name: "audio",

    install(core: EditorCore) {
      const currentTime = ref(0)
      const isPlaying = ref(false)
      let seekHandler: ((time: number) => void) | null = null

      const src = computed(
        () => core.activeChannel.activeTranslation.data.value.audio?.src ?? null,
      )

      function seekTo(time: number) {
        seekHandler?.(time)
      }

      function setSeekHandler(fn: ((time: number) => void) | null) {
        seekHandler = fn
      }

      const api: AudioPluginApi = {
        currentTime,
        isPlaying,
        src,
        seekTo,
        setSeekHandler,
      }

      core.audio = api

      return () => {
        core.audio = undefined
      }
    },
  }
}
