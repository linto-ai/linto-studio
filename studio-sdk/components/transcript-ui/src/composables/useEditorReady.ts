import { ref, watch, onScopeDispose, type Ref } from "vue"
import type { Core } from "../core/types"

// Clear the overlay after this long even if the server never reports a sync, so
// a failed or blocked collaborative connection can't leave the editor masked
// forever. Matches the timeout the host app used to apply while polling.
const READY_TIMEOUT_MS = 20000

export interface EditorReady {
  /** True while the editor is loading its first (or a freshly reloaded) document. */
  isLoading: Ref<boolean>
  /** Non-null when the editor failed to load (mirrors the plugin error). */
  error: Ref<string | null>
}

/**
 * Owns the editor's loading state so embedders don't have to poll the
 * cross-runtime sync ref themselves.
 *
 * The overlay shows until the editor can display content:
 *  - a document must be loaded (channels populated), and
 *  - in collaborative mode, the first server sync must have completed.
 *
 * Loading a new document (`document:change`, e.g. an epoch reload) shows the
 * overlay again; transient mid-session reconnections do not — `isConnected`
 * flips on every disconnect, so we only react until the first sync of a load.
 * A timeout guarantees the overlay is eventually cleared.
 */
export function useEditorReady(core: Core): EditorReady {
  const isLoading = ref(true)
  const error = ref<string | null>(null)
  let timer: ReturnType<typeof setTimeout> | undefined
  let stopStateWatch: (() => void) | null = null
  // Whether we are still waiting for the current load's first sync. Once synced,
  // later isConnected toggles (reconnections) no longer affect the overlay.
  let awaitingSync = true

  function clearTimer(): void {
    if (timer !== undefined) {
      clearTimeout(timer)
      timer = undefined
    }
  }

  function settle(): void {
    awaitingSync = false
    isLoading.value = false
    clearTimer()
  }

  function settleIfReady(): void {
    if (!awaitingSync) return
    const editor = core.transcriptionEditor
    // Viewer / no-collab embed: ready as soon as a document is present.
    if (!editor) {
      if (core.channels.size > 0) settle()
      return
    }
    if (editor.isConnected.value) settle()
  }

  // The transcriptionEditor plugin is installed before the document is set, so
  // its refs exist by the time a load begins. Watch them directly — a getter
  // through core.transcriptionEditor (a plain, non-reactive property) would
  // never re-collect the dependency once the plugin appears.
  function watchEditorState(): void {
    const editor = core.transcriptionEditor
    if (!editor || stopStateWatch) return
    stopStateWatch = watch(
      [editor.isConnected, editor.error],
      () => {
        error.value = editor.error.value
        // An error supersedes loading: drop the overlay/timer (the error
        // overlay takes over). Cleared again on the next load via reset().
        if (error.value) {
          settle()
          return
        }
        settleIfReady()
      },
      { immediate: true },
    )
  }

  // A document (re)load begins: mask until the next sync, with a timeout guard.
  function reset(): void {
    awaitingSync = true
    isLoading.value = true
    error.value = null
    clearTimer()
    timer = setTimeout(settle, READY_TIMEOUT_MS)
    watchEditorState()
    settleIfReady()
  }

  const offDocChange = core.on("document:change", reset)

  // A document may already be present when this composable runs.
  if (core.channels.size > 0) reset()

  onScopeDispose(() => {
    offDocChange()
    stopStateWatch?.()
    clearTimer()
  })

  return { isLoading, error }
}
