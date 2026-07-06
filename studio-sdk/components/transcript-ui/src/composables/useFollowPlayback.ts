import { ref, watch, onMounted, onBeforeUnmount, type Ref } from "vue"
import { useCore } from "../core"
import { activeWordRange } from "../utils/wordRange"

const SCROLL_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " ", // Space
])

export function useFollowPlayback(
  scrollContainer: Readonly<Ref<HTMLElement | null | undefined>>,
) {
  const core = useCore()
  const isFollowing = ref(true)
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches

  function scrollToActive() {
    const container = scrollContainer.value
    if (!container || !isFollowing.value) return

    const behavior: ScrollBehavior = prefersReducedMotion ? "instant" : "smooth"

    // Editor: the active word is located as a character Range (the plain-text
    // doc has no per-word element) — center its rect in the container.
    const wordId = core.audio?.activeWordId.value
    if (wordId) {
      const range = activeWordRange(container, core, wordId)
      const rect = range?.getBoundingClientRect()
      if (rect && (rect.height > 0 || rect.width > 0)) {
        const containerRect = container.getBoundingClientRect()
        const delta =
          rect.top + rect.height / 2 - (containerRect.top + container.clientHeight / 2)
        container.scrollBy({ top: delta, behavior })
        return
      }
    }

    const turnId = core.audio?.activeTurnId.value
    const target =
      // Non-editor list view still tags the active word this way.
      container.querySelector<HTMLElement>("[data-word-active]") ??
      (turnId
        ? container.querySelector<HTMLElement>(`[data-turn-id="${turnId}"]`)
        : null)
    if (!target) return
    target.scrollIntoView({ behavior, block: "center" })
  }

  // Follow the active word (works with the editor + word timestamps)
  watch(
    () => core.audio?.activeWordId.value,
    (id) => {
      if (id) scrollToActive()
    },
    { flush: "post" },
  )

  // Fallback: at least follow the turn (no editor or no word timestamps)
  watch(
    () => core.audio?.activeTurnId.value,
    (id) => {
      if (id) scrollToActive()
    },
    { flush: "post" },
  )

  // Re-enable follow when playback starts
  watch(
    () => core.audio?.isPlaying.value,
    (playing) => {
      if (playing) isFollowing.value = true
    },
  )

  function onManualScroll() {
    isFollowing.value = false
  }

  function checkKeyDownIsScroll(e: KeyboardEvent) {
    if (SCROLL_KEYS.has(e.key)) {
      onManualScroll()
    }
  }

  function setupScrollListener(handler: (e: Event) => void) {
    const el = scrollContainer.value
    if (!el) return
    el.addEventListener("wheel", handler, { passive: true })
    el.addEventListener("touchstart", handler, { passive: true })
    el.addEventListener("pointerdown", handler, { passive: true })
    el.addEventListener("keydown", checkKeyDownIsScroll)
  }

  function downScrollListener(handler: (e: Event) => void) {
    const el = scrollContainer.value
    if (!el) return
    el.removeEventListener("wheel", handler)
    el.removeEventListener("touchstart", handler)
    el.removeEventListener("pointerdown", handler)
    el.removeEventListener("keydown", checkKeyDownIsScroll)
  }

  onMounted(() => {
    setupScrollListener(onManualScroll)
  })

  onBeforeUnmount(() => {
    downScrollListener(onManualScroll)
  })

  function resumeFollow() {
    isFollowing.value = true
    scrollToActive()
  }

  return { isFollowing, resumeFollow }
}
