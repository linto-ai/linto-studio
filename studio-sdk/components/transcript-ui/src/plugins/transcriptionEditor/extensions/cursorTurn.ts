import { Extension } from "@tiptap/core"
import { Plugin, PluginKey, type EditorState } from "@tiptap/pm/state"
import { Decoration, DecorationSet, type EditorView } from "@tiptap/pm/view"

interface CursorTurnState {
  deco: DecorationSet
  focused: boolean
}

const cursorTurnKey = new PluginKey<CursorTurnState>("cursorTurn")

/**
 * Mark the turn holding the caret with a `turn--cursor` class (styled in CSS —
 * see TranscriptionPanel.vue). Walks up from the selection head in O(depth) and
 * emits a single node decoration, so PM applies the class to the turn's outer
 * DOM — no O(n) getPos() and no O(n²) per-node-view selection listener (see
 * turnNode.ts).
 */
function computeDecorations(state: EditorState): DecorationSet {
  const { $head } = state.selection
  for (let depth = $head.depth; depth > 0; depth--) {
    if ($head.node(depth).type.name === "turn") {
      return DecorationSet.create(state.doc, [
        Decoration.node($head.before(depth), $head.after(depth), {
          class: "turn--cursor",
        }),
      ])
    }
  }
  return DecorationSet.empty
}

export const CursorTurn = Extension.create({
  name: "cursorTurn",

  addProseMirrorPlugins() {
    // Focus/blur don't emit transactions, so drive the plugin state with a
    // meta-only one. Dispatching *synchronously* from the DOM handler is a
    // footgun: on a click into a blurred editor the focus event fires before PM
    // has applied the click's selection, so the dispatch would read the stale
    // selection and clobber the caret. Defer it and re-read hasFocus() then.
    let pending: ReturnType<typeof setTimeout> | null = null
    const syncFocus = (view: EditorView): void => {
      if (pending) clearTimeout(pending)
      pending = setTimeout(() => {
        pending = null
        if (!view.isDestroyed) {
          view.dispatch(view.state.tr.setMeta(cursorTurnKey, view.hasFocus()))
        }
      }, 0)
    }

    return [
      new Plugin<CursorTurnState>({
        key: cursorTurnKey,
        state: {
          init: () => ({ deco: DecorationSet.empty, focused: false }),
          apply(tr, prev, _oldState, newState) {
            const focus = tr.getMeta(cursorTurnKey) as boolean | undefined
            const focused = focus ?? prev.focused
            if (!focused) return { deco: DecorationSet.empty, focused }
            // Recompute when focus is (re)gained or the caret moves; otherwise
            // the existing decoration still holds.
            if (focus !== undefined || tr.selectionSet || tr.docChanged) {
              return { deco: computeDecorations(newState), focused }
            }
            return { deco: prev.deco, focused }
          },
        },
        props: {
          decorations: (state) => cursorTurnKey.getState(state)?.deco,
          handleDOMEvents: {
            focus: (view) => {
              syncFocus(view)
              return false
            },
            blur: (view) => {
              syncFocus(view)
              return false
            },
          },
        },
        view: () => ({
          destroy() {
            if (pending) clearTimeout(pending)
          },
        }),
      }),
    ]
  },
})
