import {
  ref,
  readonly,
  onMounted,
  onBeforeUnmount,
  type DeepReadonly,
  type Ref,
} from "vue"
import throttle from "../utils/throttle"

interface UseAutoScrollOptions {
  panelRef: Ref<HTMLElement | null>
}

interface UseAutoScrollReturn {
  isFollowing: DeepReadonly<Ref<boolean>>
  resumeFollow: () => void
}

export function useAutoScroll({
  panelRef,
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
    if (!isFollowing.value) return

    const viewport = getViewport()
    if (!viewport) return

    const activeEl =
      viewport.querySelector("[data-word-active]") ??
      viewport.querySelector("[data-turn-active]")
    if (!activeEl) return

    const elRect = activeEl.getBoundingClientRect()
    const vpRect = viewport.getBoundingClientRect()
    const targetTop =
      viewport.scrollTop +
      (elRect.top - vpRect.top) -
      viewport.clientHeight / 2 +
      elRect.height / 2

    viewport.scrollTo({
      top: targetTop,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    })
  }

  const throttledScrollToActive = throttle(scrollToActive)

  // wheel and touchstart are ONLY dispatched by user actions,
  // never by scrollIntoView — no need for a programmatic scroll guard.
  function onUserScroll() {
    isFollowing.value = false
  }

  function resumeFollow() {
    isFollowing.value = true
    scrollToActive()
  }

  let observer: MutationObserver | undefined

  onMounted(() => {
    const viewport = getViewport()
    if (!viewport) return

    viewport.addEventListener("wheel", onUserScroll, { passive: true })
    viewport.addEventListener("touchstart", onUserScroll, { passive: true })

    observer = new MutationObserver(throttledScrollToActive)
    observer.observe(viewport, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-word-active", "data-turn-active"],
      childList: true,
      characterData: true,
    })
  })

  onBeforeUnmount(() => {
    const viewport = getViewport()
    if (viewport) {
      viewport.removeEventListener("wheel", onUserScroll)
      viewport.removeEventListener("touchstart", onUserScroll)
    }
    observer?.disconnect()
  })

  return {
    isFollowing: readonly(isFollowing),
    resumeFollow,
  }
}
