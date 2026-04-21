import { onBeforeUnmount, onMounted, ref, watch } from "vue"
import type { WatermarkPluginApi } from "../../core/types"

export function useWatermarkCycle(api: WatermarkPluginApi | undefined) {
  const visible = ref(false)
  let showTimer: ReturnType<typeof setTimeout> | null = null
  let hideTimer: ReturnType<typeof setTimeout> | null = null

  function clearTimers() {
    if (showTimer) {
      clearTimeout(showTimer)
      showTimer = null
    }
    if (hideTimer) {
      clearTimeout(hideTimer)
      hideTimer = null
    }
  }

  function show() {
    if (!api || !api.display.value) return
    visible.value = true
    if (!api.pinned.value) {
      hideTimer = setTimeout(hide, api.duration.value * 1000)
    }
  }

  function hide() {
    visible.value = false
    if (!api || !api.display.value || api.pinned.value) return
    showTimer = setTimeout(show, api.frequency.value * 1000)
  }

  function restart() {
    clearTimers()
    if (!api || !api.display.value) {
      visible.value = false
      return
    }
    if (api.pinned.value) {
      visible.value = true
      return
    }
    visible.value = false
    showTimer = setTimeout(show, api.frequency.value * 1000)
  }

  if (api) {
    watch(
      [api.display, api.pinned, api.frequency, api.duration],
      restart,
    )
  }

  onMounted(restart)
  onBeforeUnmount(clearTimers)

  return { visible }
}
