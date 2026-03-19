import { ref } from "vue"
import type { EditorCore, EditorPlugin, SubtitlePluginApi } from "../../core/types"

export type { SubtitlePluginApi }

export interface SubtitlePluginOptions {
  fontSize?: number
}

export function createSubtitlePlugin(
  options: SubtitlePluginOptions = {},
): EditorPlugin {
  return {
    name: "subtitle",

    install(core: EditorCore) {
      const fontSize = ref(options.fontSize ?? 40)
      const isVisible = ref(true)
      const isFullscreen = ref(false)

      const api: SubtitlePluginApi = {
        fontSize,
        isVisible,
        isFullscreen,
        enterFullscreen() {
          isFullscreen.value = true
        },
        exitFullscreen() {
          isFullscreen.value = false
        },
      }

      core.subtitle = api

      return () => {
        isVisible.value = false
        isFullscreen.value = false
        core.subtitle = undefined
      }
    },
  }
}
