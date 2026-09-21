import { onMounted, onUnmounted, watch, type ComputedRef, type Ref } from "vue"
import { useCore } from "@linto-ai/transcript-ui-core"
import { SubtitleScroller } from "./SubtitleScroller"

interface UseSubtitleScrollerOptions {
  canvasRef: Readonly<Ref<HTMLCanvasElement | null>>
  fontSize: Ref<number> | ComputedRef<number>
  lineHeight: Ref<number> | ComputedRef<number>
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
      fontSize: options.fontSize.value,
      lineHeight: options.lineHeight.value,
    })
  })

  watch([options.fontSize, options.lineHeight], ([fs, lh]) => {
    if (!scroller) return
    scroller.setFontSize(fs, lh)
  })

  watch(
    () => core.live?.partial.value,
    (text) => {
      if (text && scroller) scroller.newPartial(text)
    },
  )

  // Clearing core.live.partial is routine — it happens on every finalized
  // turn — so the scroller ignores it and keeps the text on screen. Turning
  // the setting off is the one case where the line must actually go.
  watch(
    () => core.live?.partialsVisible.value,
    (visible) => {
      if (visible === false) scroller?.clearPartial()
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
