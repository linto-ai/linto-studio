import {
  ref,
  readonly,
  watch,
  onBeforeUnmount,
  type ComputedRef,
  type DeepReadonly,
  type Ref,
  type ShallowRef,
} from "vue"
import type { AudioContext } from "./useAudioContext"
import type { Turn } from "../types/editor"
import throttle from "../utils/throttle"

interface UseAutoScrollOptions {
  panelRef: Ref<HTMLElement | null>
  playback: AudioContext | null
  activeTurns?: ComputedRef<Turn[]>
  partial?: ShallowRef<string | null>
}

interface UseAutoScrollReturn {
  isFollowing: DeepReadonly<Ref<boolean>>
  isLiveMode: boolean
  resumeFollow: () => void
}

export function useAutoScroll({
  panelRef,
  playback,
  activeTurns,
  partial,
}: UseAutoScrollOptions): UseAutoScrollReturn {
  const isFollowing = ref(true)

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  )

  function getViewport(): HTMLElement | null {
    return (
      panelRef.value?.querySelector("[data-reka-scroll-area-viewport]") ?? null
    )
  }

  function scrollToActive() {
    const viewport = getViewport()
    if (!viewport) return

    const activeEl =
      viewport.querySelector("[data-word-active]") ??
      viewport.querySelector("[data-turn-active]")
    if (!activeEl) return

    activeEl.scrollIntoView({
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
      block: "center",
    })
  }

  const throttledScrollToActive =
    isFollowing.value && playback?.isPlaying?.value
      ? throttle(scrollToActive)
      : () => {}

  function scrollToBottom() {
    const viewport = getViewport()
    if (!viewport) return
    viewport.scrollTo({
      top: viewport.scrollHeight,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    })
  }

  const throttledScrollToBottom = isFollowing.value
    ? throttle(scrollToBottom)
    : () => {}

  // wheel and touchstart are ONLY dispatched by user actions,
  // never by scrollIntoView — no need for a programmatic scroll guard.
  function onUserScroll() {
    isFollowing.value = false
  }

  const isLive = !playback

  function resumeFollow() {
    isFollowing.value = true
    if (isLive) {
      scrollToBottom()
    } else {
      scrollToActive()
    }
  }

  // Attach/detach user-scroll listeners when panel mounts
  let cleanupListeners: (() => void) | undefined

  function attachListeners(viewport: HTMLElement) {
    viewport.addEventListener("wheel", onUserScroll, { passive: true })
    viewport.addEventListener("touchstart", onUserScroll, { passive: true })
    cleanupListeners = () => {
      viewport.removeEventListener("wheel", onUserScroll)
      viewport.removeEventListener("touchstart", onUserScroll)
    }
  }

  watch(
    () => panelRef.value,
    (panel, _oldPanel, onCleanup) => {
      cleanupListeners?.()
      cleanupListeners = undefined
      if (panel) {
        const viewport = panel.querySelector<HTMLElement>(
          "[data-reka-scroll-area-viewport]",
        )
        if (viewport) {
          attachListeners(viewport)
          onCleanup(() => {
            cleanupListeners?.()
            cleanupListeners = undefined
          })
        }
      }
    },
    { immediate: true },
  )

  // Auto-scroll when currentTime changes
  if (playback) {
    watch(playback.currentTime, throttledScrollToActive)

    // Re-enable following when playback starts
    watch(playback.isPlaying, throttledScrollToActive)
  } else {
    // Live mode: scroll to bottom when new turns arrive or partial updates
    watch(activeTurns, throttledScrollToBottom, { flush: "post" })

    watch(partial, throttledScrollToBottom, { flush: "post" })
  }

  onBeforeUnmount(() => {
    cleanupListeners?.()
  })

  return {
    isFollowing: readonly(isFollowing),
    isLiveMode: isLive,
    resumeFollow,
  }
}
