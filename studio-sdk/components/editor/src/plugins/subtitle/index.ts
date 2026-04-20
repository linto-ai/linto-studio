import { ref, watch } from "vue"
import type {
  EditorStore,
  EditorPlugin,
  SubtitlePluginApi,
  WatermarkPluginApi,
  WatermarkToken,
} from "../../core/types"

export type { SubtitlePluginApi, WatermarkPluginApi, WatermarkToken }

export interface WatermarkOptions {
  display?: boolean
  pinned?: boolean
  content?: string
  frequency?: number
  duration?: number
  tokens?: Record<string, WatermarkToken>
  readonly?: boolean
}

export interface SubtitlePluginOptions {
  fontSize?: number
  watermark?: WatermarkOptions
}

export function createSubtitlePlugin(
  options: SubtitlePluginOptions = {},
): EditorPlugin {
  return {
    name: "subtitle",

    install(core: EditorStore) {
      const fontSize = ref(options.fontSize ?? 40)
      const isVisible = ref(true)
      const isFullscreen = ref(false)

      let watermark: WatermarkPluginApi | undefined
      const unwatchers: Array<() => void> = []
      if (options.watermark) {
        const w = options.watermark
        watermark = {
          display: ref(w.display ?? false),
          pinned: ref(w.pinned ?? false),
          content: ref(w.content ?? ""),
          frequency: ref(w.frequency ?? 30),
          duration: ref(w.duration ?? 5),
          tokens: ref(w.tokens ?? {}),
          readonly: w.readonly ?? false,
        }
        unwatchers.push(
          watch(watermark.display, (display) =>
            core.emit("watermark:display", { display }),
          ),
          watch(watermark.pinned, (pinned) =>
            core.emit("watermark:pin", { pinned }),
          ),
        )
      }

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
        watermark,
      }

      core.subtitle = api

      return () => {
        isVisible.value = false
        isFullscreen.value = false
        unwatchers.forEach((stop) => stop())
        core.subtitle = undefined
      }
    },
  }
}
