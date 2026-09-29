import type { Ref } from "vue"
import { useCore } from "../core/useCore"

/** The core owns the breakpoint (see core/modules/viewport) — this is the
 *  component-side reader, kept as a composable for the call sites that had
 *  one, and for plugin panels that switch layout at the same width. */
export function useIsMobile(): { isMobile: Readonly<Ref<boolean>> } {
  return { isMobile: useCore().isMobile }
}
