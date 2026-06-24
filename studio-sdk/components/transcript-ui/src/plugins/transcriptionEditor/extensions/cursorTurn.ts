import { Extension } from "@tiptap/core"
import { Plugin, PluginKey, type EditorState } from "@tiptap/pm/state"
import { Decoration, DecorationSet, type EditorView } from "@tiptap/pm/view"

const cursorTurnKey = new PluginKey("cursorTurn")

// Decorate the turn that currently holds the caret with a `turn--cursor` class.
//
// Unlike the per-node-view `selectionUpdate` listener (disabled in turnNode.ts
// because it runs an O(n) getPos() per turn → O(n²) per keystroke), this walks
// up from the selection head in O(depth) and emits a single node decoration.
// ProseMirror applies the class to the turn node's outer DOM, so no DOM
// traversal and only the two affected turns are patched.
function computeDecorations(state: EditorState): DecorationSet {
  const { $head } = state.selection
  for (let depth = $head.depth; depth > 0; depth--) {
    if ($head.node(depth).type.name === "turn") {
      const from = $head.before(depth)
      const to = $head.after(depth)
      return DecorationSet.create(state.doc, [
        Decoration.node(from, to, { class: "turn--cursor" }),
      ])
    }
  }
  return DecorationSet.empty
}

interface CursorTurnState {
  deco: DecorationSet
  focused: boolean
}

export const CursorTurn = Extension.create({
  name: "cursorTurn",

  addProseMirrorPlugins() {
    // Dispatching a transaction *synchronously* inside the focus/blur DOM
    // handlers is a ProseMirror footgun: on a click into a blurred editor the
    // focus event fires before PM has applied the click's selection, so the
    // dispatch (a) recomputes from the stale pre-click selection and (b) forces
    // an updateState that writes that stale selection back to the DOM, clobbering
    // the click's caret. Defer the dispatch so the selection settles first, and
    // re-read hasFocus() at dispatch time to stay correct under rapid focus/blur.
    let pendingFocusSync: ReturnType<typeof setTimeout> | null = null
    function scheduleFocusSync(view: EditorView): void {
      if (pendingFocusSync) clearTimeout(pendingFocusSync)
      pendingFocusSync = setTimeout(() => {
        pendingFocusSync = null
        if (view.isDestroyed) return
        view.dispatch(
          view.state.tr.setMeta(cursorTurnKey, { focused: view.hasFocus() }),
        )
      }, 0)
    }

    return [
      new Plugin<CursorTurnState>({
        key: cursorTurnKey,
        state: {
          init() {
            // Wait for the first focus event: ProseMirror keeps the selection
            // on blur, so the decoration must follow focus, not just the caret.
            return { deco: DecorationSet.empty, focused: false }
          },
          apply(tr, old, _oldState, newState) {
            const meta = tr.getMeta(cursorTurnKey) as
              | { focused: boolean }
              | undefined
            const focused = meta ? meta.focused : old.focused

            if (!focused) return { deco: DecorationSet.empty, focused }

            // Recompute when focus is gained or the caret moves; otherwise the
            // existing decoration is still valid.
            if (meta || tr.selectionSet || tr.docChanged) {
              return { deco: computeDecorations(newState), focused }
            }
            return { deco: old.deco, focused }
          },
        },
        props: {
          decorations(state) {
            return cursorTurnKey.getState(state)?.deco
          },
          // Blur/focus don't emit transactions on their own, so turn them into
          // meta-only transactions to drive the plugin state (deferred — see
          // scheduleFocusSync).
          handleDOMEvents: {
            focus(view) {
              scheduleFocusSync(view)
              return false
            },
            blur(view) {
              scheduleFocusSync(view)
              return false
            },
          },
        },
        view() {
          return {
            destroy() {
              if (pendingFocusSync) clearTimeout(pendingFocusSync)
            },
          }
        },
      }),
    ]
  },
})
