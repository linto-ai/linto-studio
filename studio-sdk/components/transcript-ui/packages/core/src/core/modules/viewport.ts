import { ref, type Ref } from "vue"

/** Same width the layout's CSS switches on — keep the two in sync. */
const MOBILE_BREAKPOINT = "(max-width: 767px)"

export interface Viewport {
  readonly isMobile: Readonly<Ref<boolean>>
  destroy(): void
}

/** Owns the mobile-width media query for the whole core: one listener for
 *  every consumer, released on core.destroy(). `onChange` fires on every
 *  crossing of the breakpoint, synchronously — what the core hangs its
 *  layout invariants on, rather than a watcher that lands a tick later.
 *
 *  Outside a browser (unit tests run without a DOM) there is no viewport to
 *  watch, so isMobile stays false rather than the core failing to build. */
export function createViewport(
  onChange: (isMobile: boolean) => void,
): Viewport {
  const isMobile = ref(false)

  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return { isMobile, destroy() {} }
  }

  // Read synchronously, not on mount: the first render must already match
  // the viewport, or a phone briefly mounts desktop-only UI before swapping.
  const query = window.matchMedia(MOBILE_BREAKPOINT)
  isMobile.value = query.matches

  function onQueryChange(event: MediaQueryListEvent): void {
    isMobile.value = event.matches
    onChange(event.matches)
  }

  query.addEventListener("change", onQueryChange)

  return {
    isMobile,
    destroy() {
      query.removeEventListener("change", onQueryChange)
    },
  }
}
