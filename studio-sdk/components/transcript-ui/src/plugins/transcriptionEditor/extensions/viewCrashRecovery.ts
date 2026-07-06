import { Extension } from "@tiptap/core"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import type { EditorView } from "@tiptap/pm/view"

const viewCrashRecoveryKey = new PluginKey("viewCrashRecovery")

export interface ViewCrashRecoveryOptions {
  /** Called (once, asynchronously) after a view update crashed. The owner is
   *  expected to destroy this editor and build a fresh one on the same doc. */
  onCrash: () => void
}

/**
 * Last line of defense against prosemirror-view render crashes.
 *
 * The span-per-word structure (word spans + bare whitespace text nodes) can
 * crash prosemirror-view's own DOM reconciliation (renderDescs/updateChildren,
 * rm(null) → "Cannot read properties of null (reading 'nextSibling')") while
 * it applies a perfectly clean transaction — flight-recorder proven with zero
 * decorations and zero native mutations in the content. When that happens the
 * viewDesc↔DOM tree is corrupted and every subsequent update crashes again,
 * visually shredding the turn.
 *
 * The document itself (PM state and Y.Doc) stays consistent — only the view
 * is broken. So the recovery is a full editor rebuild on the same Y.Doc: the
 * initial render walks the doc fresh instead of diffing a corrupted tree.
 * Costs a caret reset; prevents data-loss-looking cascades.
 */
export const ViewCrashRecovery = Extension.create<ViewCrashRecoveryOptions>({
  name: "viewCrashRecovery",

  addProseMirrorPlugins() {
    const { onCrash } = this.options
    return [
      new Plugin({
        key: viewCrashRecoveryKey,
        view: (view) => new RecoveryView(view, onCrash),
      }),
    ]
  },
})

const PATCHED_METHODS = ["updateState", "update"] as const
type PatchedMethod = (typeof PATCHED_METHODS)[number]
type PatchableView = Record<PatchedMethod, (...args: unknown[]) => void>

class RecoveryView {
  private readonly view: EditorView
  private readonly wrappers = new Map<PatchedMethod, (...args: unknown[]) => void>()
  private triggered = false

  /** This extension must be registered LAST so this wrapper is outermost —
   *  the debug recorder's own wrapper (when active) records the crash and
   *  rethrows; this one catches it and swallows it, since the whole view is
   *  about to be replaced anyway. */
  constructor(view: EditorView, onCrash: () => void) {
    this.view = view
    const patchable = view as unknown as PatchableView
    for (const method of PATCHED_METHODS) {
      const original = patchable[method].bind(view)
      const wrapper = (...args: unknown[]): void => {
        try {
          original(...args)
        } catch (error) {
          if (!this.triggered) {
            this.triggered = true
            console.error(
              "[transcriptionEditor] editor view crashed while rendering — rebuilding it",
              error,
            )
            // Escape the crashing call stack (often a beforeinput handler or
            // a Yjs observer) before tearing the editor down.
            setTimeout(onCrash, 0)
          }
        }
      }
      this.wrappers.set(method, wrapper)
      patchable[method] = wrapper
    }
  }

  destroy(): void {
    const patchable = this.view as unknown as PatchableView
    for (const method of PATCHED_METHODS) {
      // Only unpatch if still ours: deleting the own property restores the
      // prototype method (and drops any inner debug wrapper with it, which is
      // fine — plugin views are destroyed together).
      if (patchable[method] === this.wrappers.get(method)) {
        delete (patchable as Partial<PatchableView>)[method]
      }
    }
  }
}
