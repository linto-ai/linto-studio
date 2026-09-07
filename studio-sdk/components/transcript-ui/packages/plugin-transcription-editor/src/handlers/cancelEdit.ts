import type { EditorPluginState } from "../types"
import { exitEditMode } from "../tools/exitEditMode"
import { pushUnlock } from "../tools/pushUnlock"

/** Leave edit mode without committing — the lock is released. */
export function cancelEdit(state: EditorPluginState): void {
  const target = exitEditMode(state)
  if (target) void pushUnlock(state.options, target)
}
