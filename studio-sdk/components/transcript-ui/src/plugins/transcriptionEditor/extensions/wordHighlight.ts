import { watch } from "vue"
import { Extension } from "@tiptap/core"
import { Plugin, PluginKey, type EditorState } from "@tiptap/pm/state"
import { Decoration, DecorationSet } from "@tiptap/pm/view"
import { yCursorPluginKey } from "@tiptap/y-tiptap"
import type { Core } from "../../../core/types"

const wordHighlightKey = new PluginKey("wordHighlight")

const EDIT_PAUSE_MS = 1000

// Global PM state exposing whether we're in "editing mode": an expiration
// timestamp bumped on every transaction that mutates the doc (local edit
// or remote Yjs sync — `tr.docChanged` covers both). Pure read via
// `isEditing(state)`.
//
// Why this state exists: during editing, dispatching the word highlight
// decoration (triggered ~60Hz by audio ticks) races with the in-flight DOM
// patch and crashes PM updateChildren (nextSibling=null), with visible
// duplication of the active word.
const editingStateKey = new PluginKey<{ editingUntil: number }>("editingState")

export function isEditing(state: EditorState): boolean {
  const s = editingStateKey.getState(state)
  return !!s && Date.now() < s.editingUntil
}

export interface WordHighlightOptions {
  core: Core
}

export const WordHighlight = Extension.create<WordHighlightOptions>({
  name: "wordHighlight",

  addProseMirrorPlugins() {
    const { core } = this.options
    const editor = this.editor

    // Returns true if a remote client's caret or selection sits inside the
    // [turnFrom, turnTo] range. In local mode (no collab), the yCursorPlugin
    // is not installed → state undefined → false.
    // Avoids the inline (word--active) + widget (remote caret) decoration
    // conflict that crashed PM updateChildren and duplicated the word.
    function hasRemoteCursorInTurn(turnFrom: number, turnTo: number): boolean {
      const cursorSet = yCursorPluginKey.getState(editor.state)
      return !!cursorSet && cursorSet.find(turnFrom, turnTo).length > 0
    }

    function computeDecorations(): DecorationSet {
      const activeId = core.audio?.activeWordId.value
      console.log(activeId)
      if (!activeId) return DecorationSet.empty

      const translation = core.activeChannel.value?.activeTranslation.value
      if (!translation) return DecorationSet.empty

      const doc = editor.state.doc
      let result: DecorationSet = DecorationSet.empty

      doc.forEach((node, offset) => {
        if (node.type.name !== "turn") return

        const turn = translation.turns.value.find((t) => t.id === node.attrs.id)
        if (!turn) return

        if (hasRemoteCursorInTurn(offset, offset + node.nodeSize)) return

        const text = node.textContent
        let charPos = 0
        for (const word of turn.words) {
          const idx = text.indexOf(word.text, charPos)
          if (idx === -1) break
          if (word.id === activeId) {
            const from = offset + 1 + idx
            const to = from + word.text.length
            result = DecorationSet.create(doc, [
              Decoration.inline(from, to, {
                class: "word--active",
                "data-word-active": "",
              }),
            ])
            return
          }
          charPos = idx + word.text.length
        }
      })

      return result
    }

    let unwatch: (() => void) | null = null

    return [
      // Must be registered before wordHighlight: wordHighlight's `apply`
      // reads `isEditing(newState)` and relies on this state being fresh.
      new Plugin({
        key: editingStateKey,
        state: {
          init() {
            return { editingUntil: 0 }
          },
          apply(tr, old) {
            if (tr.docChanged) {
              return { editingUntil: Date.now() + EDIT_PAUSE_MS }
            }
            return old
          },
        },
      }),

      new Plugin({
        key: wordHighlightKey,

        state: {
          init() {
            return DecorationSet.empty
          },
          apply(tr, old, _oldState, newState) {
            console.log("l0")

            if (tr.docChanged) return DecorationSet.empty
            console.log("l1")
            if (tr.getMeta(wordHighlightKey)) {
              console.log("plop")
              if (isEditing(newState)) return old
              console.log("truc")

              return computeDecorations()
            }
            return old
          },
        },

        props: {
          decorations(state) {
            return wordHighlightKey.getState(state)
          },
        },

        view() {
          // Re-trigger decoration computation whenever audio emits a new active word.
          unwatch = watch(
            () => core.audio?.activeWordId.value,
            () => {
              if (isEditing(editor.state)) return
              const tr = editor.state.tr.setMeta(wordHighlightKey, true)
              editor.view.dispatch(tr)
            },
          )

          return {
            destroy() {
              unwatch?.()
            },
          }
        },
      }),
    ]
  },
})
