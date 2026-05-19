import { onMounted, onUnmounted, watch, type ComputedRef, type Ref } from "vue"
import { useEditorStore } from "../core"
import { SubtitleScroller } from "../plugins/subtitle/SubtitleScroller"

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
  const editor = useEditorStore()
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
    () => editor.live?.partial.value,
    (text) => {
      if (text && scroller) scroller.newPartial(text)
    },
  )

  const unsubTurnAdd = editor.onActiveTranslation("turn:add", ({ turn }) => {
    if (!scroller) return
    const text = turn.words.length > 0
      ? turn.words.map((w) => w.text).join(" ")
      : turn.text ?? ""
    if (text) scroller.newFinal(text)
  })

  function resetScroller(): void {
    if (!scroller) return
    scroller.resetDrawing()
    scroller.resetAll()
  }

  const unsubTranslationChange = editor.on("translation:change", resetScroller)
  const unsubTranslationSync = editor.on("translation:sync", resetScroller)
  const unsubChannelSync = editor.on("channel:sync", resetScroller)

  onUnmounted(() => {
    unsubTurnAdd()
    unsubTranslationChange()
    unsubTranslationSync()
    unsubChannelSync()
    scroller?.dispose()
    scroller = null
  })
}
