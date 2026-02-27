import { ref, readonly, watch, onBeforeUnmount, type DeepReadonly, type Ref } from 'vue'
import type { AudioContext } from './useAudioContext'

interface UseAutoScrollOptions {
  panelRef: Ref<HTMLElement | null>
  playback: AudioContext | null
}

interface UseAutoScrollReturn {
  isFollowing: DeepReadonly<Ref<boolean>>
  resumeFollow: () => void
}

export function useAutoScroll({ panelRef, playback }: UseAutoScrollOptions): UseAutoScrollReturn {
  const isFollowing = ref(true)
  let throttleTimer: ReturnType<typeof setTimeout> | undefined
  let isThrottled = false

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

  function getViewport(): HTMLElement | null {
    return panelRef.value?.querySelector('[data-reka-scroll-area-viewport]') ?? null
  }

  function scrollToActive() {
    const viewport = getViewport()
    if (!viewport) return

    const activeEl =
      viewport.querySelector('[data-word-active]') ??
      viewport.querySelector('[data-turn-active]')
    if (!activeEl) return

    activeEl.scrollIntoView({
      behavior: prefersReducedMotion.matches ? 'auto' : 'smooth',
      block: 'center',
    })
  }

  function throttledScrollToActive() {
    if (isThrottled) return
    isThrottled = true
    scrollToActive()
    throttleTimer = setTimeout(() => {
      isThrottled = false
    }, 250)
  }

  // wheel and touchstart are ONLY dispatched by user actions,
  // never by scrollIntoView — no need for a programmatic scroll guard.
  function onUserScroll() {
    isFollowing.value = false
  }

  function resumeFollow() {
    isFollowing.value = true
    scrollToActive()
  }

  // Attach/detach user-scroll listeners when panel mounts
  let cleanupListeners: (() => void) | undefined

  function attachListeners(viewport: HTMLElement) {
    viewport.addEventListener('wheel', onUserScroll, { passive: true })
    viewport.addEventListener('touchstart', onUserScroll, { passive: true })
    cleanupListeners = () => {
      viewport.removeEventListener('wheel', onUserScroll)
      viewport.removeEventListener('touchstart', onUserScroll)
    }
  }

  watch(() => panelRef.value, (panel, _oldPanel, onCleanup) => {
    cleanupListeners?.()
    cleanupListeners = undefined
    if (panel) {
      const viewport = panel.querySelector<HTMLElement>('[data-reka-scroll-area-viewport]')
      if (viewport) {
        attachListeners(viewport)
        onCleanup(() => {
          cleanupListeners?.()
          cleanupListeners = undefined
        })
      }
    }
  }, { immediate: true })

  // Auto-scroll when currentTime changes
  if (playback) {
    watch(playback.currentTime, () => {
      if (isFollowing.value && playback.isPlaying.value) {
        throttledScrollToActive()
      }
    })

    // Re-enable following when playback starts
    watch(playback.isPlaying, (playing) => {
      if (playing) {
        isFollowing.value = true
        scrollToActive()
      }
    })
  }

  onBeforeUnmount(() => {
    cleanupListeners?.()
    clearTimeout(throttleTimer)
  })

  return {
    isFollowing: readonly(isFollowing),
    resumeFollow,
  }
}
