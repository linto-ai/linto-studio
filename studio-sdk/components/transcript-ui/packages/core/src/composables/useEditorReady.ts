import { ref, onScopeDispose, type Ref } from "vue"
import type { Core } from "../core/types"

// Clear the overlay after this long even if no document ever arrives, so a
// failed load can't leave the editor masked forever.
const READY_TIMEOUT_MS = 20000

export interface EditorReady {
  /** True while the editor is loading its first (or a freshly reloaded) document. */
  isLoading: Ref<boolean>
  /** Non-null when the editor failed to load. */
  error: Ref<string | null>
}

/**
 * Owns the editor's loading state so embedders don't have to track it.
 *
 * The overlay shows until a document is loaded (channels populated). Loading a
 * new document (`document:change`) resolves it immediately — setDocument is
 * synchronous — so the reset only matters for the initial mount, where the
 * host may set the document long after the component tree is up. A timeout
 * guarantees the overlay is eventually cleared.
 */
export function useEditorReady(core: Core): EditorReady {
  const isLoading = ref(true)
  const error = ref<string | null>(null)
  let timer: ReturnType<typeof setTimeout> | undefined

  function clearTimer(): void {
    if (timer !== undefined) {
      clearTimeout(timer)
      timer = undefined
    }
  }

  function settle(): void {
    isLoading.value = false
    clearTimer()
  }

  function reset(): void {
    error.value = null
    if (core.channels.size > 0) {
      settle()
      return
    }
    isLoading.value = true
    clearTimer()
    timer = setTimeout(settle, READY_TIMEOUT_MS)
  }

  const offDocChange = core.on("document:change", reset)

  reset()

  onScopeDispose(() => {
    offDocChange()
    clearTimer()
  })

  return { isLoading, error }
}
