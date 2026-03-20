import {
  ref,
  readonly,
  onMounted,
  onBeforeUnmount,
  type DeepReadonly,
  type Ref,
} from "vue"
import * as utils from "../utils"

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

  let viewport: HTMLElement | null = null

  function scrollToActive() {
    if (!isFollowing.value) return
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

  const throttledScrollToActive = utils.throttle(scrollToActive)

  function onScroll() {
    if (!viewport) return
    isFollowing.value =
      viewport.scrollHeight - viewport.scrollTop < viewport.clientHeight + 150
  }

  function resumeFollow() {
    isFollowing.value = true
    scrollToActive()
  }

  let observer: MutationObserver | undefined

  onMounted(() => {
    viewport =
      panelRef.value?.querySelector("[data-reka-scroll-area-viewport]") ?? null
    if (!viewport) return

    viewport.scrollTop = viewport.scrollHeight

    viewport.addEventListener("scroll", onScroll, { passive: true })

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
    if (viewport) {
      viewport.removeEventListener("scroll", onScroll)
      viewport = null
    }
    observer?.disconnect()
  })

  return {
    isFollowing: readonly(isFollowing),
    resumeFollow,
  }
}
