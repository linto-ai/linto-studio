import { onMounted, onUnmounted, watch, type Ref } from "vue"
import { useCore } from "../core"
import { SubtitleScroller } from "../plugins/subtitle/SubtitleScroller"

interface UseSubtitleScrollerOptions {
  canvasRef: Readonly<Ref<HTMLCanvasElement | null>>
  fontSize: number
  lineHeight: number
}

/**
 * Wires a SubtitleScroller to editor events (live partials, turn adds, sync resets).
 * Handles creation on mount and full cleanup on unmount.
 */
export function useSubtitleScroller(options: UseSubtitleScrollerOptions) {
  const core = useCore()
  let scroller: SubtitleScroller | null = null

  onMounted(() => {
    if (!options.canvasRef.value) return
    scroller = new SubtitleScroller(options.canvasRef.value, {
      fontSize: options.fontSize,
      lineHeight: options.lineHeight,
    })
  })

  watch(
    () => core.live?.partial.value,
    (text) => {
      if (text && scroller) scroller.newPartial(text)
    },
  )

  const unsubTurnAdd = core.onActiveTranslation("turn:add", ({ turn }) => {
    if (!scroller) return
    const text =
      turn.words.length > 0
        ? turn.words.map((w) => w.text).join(" ")
        : (turn.text ?? "")
    if (text) scroller.newFinal(text)
  })

  function resetScroller(): void {
    if (!scroller) return
    scroller.resetDrawing()
    scroller.resetAll()
  }

  const unsubTranslationChange = core.on("translation:change", resetScroller)
  const unsubTranslationSync = core.on("translation:sync", resetScroller)
  const unsubChannelSync = core.on("channel:sync", resetScroller)

  onUnmounted(() => {
    unsubTurnAdd()
    unsubTranslationChange()
    unsubTranslationSync()
    unsubChannelSync()
    scroller?.dispose()
    scroller = null
  })
}
