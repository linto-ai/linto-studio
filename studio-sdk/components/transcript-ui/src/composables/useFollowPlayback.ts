import { ref, watch, onMounted, onBeforeUnmount, type Ref } from "vue"
import { useCore } from "../core"

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

    const wordId = core.audio?.activeWordId.value
    const turnId = core.audio?.activeTurnId.value
    const target =
      // Editor: the active word is its `[data-wid]` span (highlight is CSS-only,
      // so there is no `[data-word-active]` element there anymore).
      (wordId
        ? container.querySelector<HTMLElement>(
            `[data-wid="${wordId.replace(/["\\]/g, "\\$&")}"]`,
          )
        : null) ??
      // Non-editor list view still tags the active word this way.
      container.querySelector<HTMLElement>("[data-word-active]") ??
      (turnId
        ? container.querySelector<HTMLElement>(`[data-turn-id="${turnId}"]`)
        : null)
    if (!target) return
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "instant" : "smooth",
      block: "center",
    })
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
