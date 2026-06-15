import { watch } from "vue"
import { Extension } from "@tiptap/core"
import { Plugin, PluginKey, type EditorState } from "@tiptap/pm/state"
import { Decoration, DecorationSet } from "@tiptap/pm/view"
import type { Node as ProseMirrorNode } from "@tiptap/pm/model"
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

    // Locate the active turn node without traversing the whole document.
    // ProseMirror has no by-id node lookup, but the TurnNodeView renders a
    // `[data-turn-id]` element, so the browser's DOM index gives us the node
    // in O(1); posAtDOM maps it back to a doc position. `resolve` then
    // normalizes whatever position posAtDOM returns (node boundary or content)
    // to the enclosing turn, and we assert the id to guard against any
    // mis-mapping. Returns the content-start position (= node start + 1).
    function locateTurn(
      doc: ProseMirrorNode,
      turnId: string,
    ): { contentStart: number; node: ProseMirrorNode } | null {
      const el = editor.view.dom.querySelector(
        `[data-turn-id="${CSS.escape(turnId)}"]`,
      )
      if (!el) return null

      let pos: number
      try {
        pos = editor.view.posAtDOM(el as HTMLElement, 0)
      } catch {
        return null
      }
      const clamped = Math.max(0, Math.min(pos, doc.content.size))
      const $pos = doc.resolve(clamped)

      // posAtDOM landed inside the turn → the depth-1 ancestor is the turn.
      if ($pos.depth >= 1) {
        const node = $pos.node(1)
        if (node.type.name === "turn" && node.attrs.id === turnId) {
          return { contentStart: $pos.start(1), node }
        }
      }
      // posAtDOM landed on the turn's opening boundary → node starts here.
      const at = doc.nodeAt(clamped)
      if (at && at.type.name === "turn" && at.attrs.id === turnId) {
        return { contentStart: clamped + 1, node: at }
      }
      return null
    }

    function computeDecorations(): DecorationSet {
      const activeId = core.audio?.activeWordId.value
      const activeTurnId = core.audio?.activeTurnId.value

      if (!activeId || !activeTurnId) return DecorationSet.empty

      const translation = core.activeChannel.value?.activeTranslation.value
      if (!translation) return DecorationSet.empty

      const turn = translation.getTurn(activeTurnId)
      if (!turn) return DecorationSet.empty

      const doc = editor.state.doc
      const located = locateTurn(doc, activeTurnId)
      if (!located) return DecorationSet.empty
      const { contentStart, node } = located

      // contentStart - 1 is the node's start; range = [start, start + nodeSize].
      if (
        hasRemoteCursorInTurn(contentStart - 1, contentStart - 1 + node.nodeSize)
      ) {
        return DecorationSet.empty
      }

      const text = node.textContent
      let charPos = 0
      for (const word of turn.words) {
        const idx = text.indexOf(word.text, charPos)
        if (idx === -1) break
        if (word.id === activeId) {
          const from = contentStart + idx
          const to = from + word.text.length
          return DecorationSet.create(doc, [
            Decoration.inline(from, to, {
              class: "word--active",
              "data-word-active": "",
            }),
          ])
        }
        charPos = idx + word.text.length
      }

      return DecorationSet.empty
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
            if (tr.docChanged) return DecorationSet.empty
            if (tr.getMeta(wordHighlightKey)) {
              if (isEditing(newState)) return old
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
