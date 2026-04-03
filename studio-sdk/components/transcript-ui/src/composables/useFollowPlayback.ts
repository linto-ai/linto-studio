import { ref, computed, watch, onMounted, onBeforeUnmount, type Ref } from "vue"
import { useCore } from "../core"
import type { Turn } from "../types/editor"

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
  turns: Ref<Turn[]>,
) {
  const core = useCore()
  const isFollowing = ref(true)

  const activeTurnId = computed(() => {
    // todo: optimize...
    if (!core.audio?.isPlaying.value) return null
    const time = core.audio.currentTime.value
    for (const turn of turns.value) {
      if (
        turn.startTime != null &&
        turn.endTime != null &&
        time >= turn.startTime &&
        time <= turn.endTime
      ) {
        return turn.id
      }
    }
    return null
  })

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches

  function scrollToActive() {
    console.log("scroll")
    const container = scrollContainer.value
    if (!container || !activeTurnId.value) return

    const target =
      container.querySelector<HTMLElement>("[data-word-active]") ??
      container.querySelector<HTMLElement>(
        `[data-turn-id="${activeTurnId.value}"]`,
      )
    if (!target) return

    target.scrollIntoView({
      block: "center",
      behavior: prefersReducedMotion ? "instant" : "smooth",
    })
  }

  watch(activeTurnId, (id) => {
    console.log("active", id)
    if (!id || !isFollowing.value) return
    scrollToActive()
  })

  // Re-enable follow when playback starts
  watch(
    () => core.audio?.isPlaying.value,
    (playing) => {
      if (playing) isFollowing.value = true
    },
  )

  // Detect manual scroll to pause follow
  function onManualScroll() {
    isFollowing.value = false
  }

  function checkKeyDownIsScroll(e: KeyboardEvent) {
    if (SCROLL_KEYS.has(e.key)) {
      onManualScroll()
    }
  }

  function setupScrollListener(handler: any) {
    // mouse wheel
    scrollContainer.value?.addEventListener("wheel", handler, { passive: true })

    // Tactile
    scrollContainer.value?.addEventListener("touchstart", handler, {
      passive: true,
    })

    // Scrollbar click
    scrollContainer.value?.addEventListener("pointerdown", handler, {
      passive: true,
    })

    scrollContainer.value?.addEventListener("keydown", checkKeyDownIsScroll)
  }

  function downScrollListener(handler: any) {
    // mouse wheel
    scrollContainer.value?.removeEventListener("wheel", handler)

    // Tactile
    scrollContainer.value?.removeEventListener("touchstart", handler)

    // Scrollbar click
    scrollContainer.value?.removeEventListener("pointerdown", handler)

    scrollContainer.value?.removeEventListener("keydown", checkKeyDownIsScroll)
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

  return { isFollowing, activeTurnId, resumeFollow }
}
