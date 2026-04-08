import { watch } from "vue"
import { Extension } from "@tiptap/core"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import { Decoration, DecorationSet } from "@tiptap/pm/view"
import type { Core } from "../../../core/types"

const wordHighlightKey = new PluginKey("wordHighlight")

export interface WordHighlightOptions {
  core: Core
}

export const WordHighlight = Extension.create<WordHighlightOptions>({
  name: "wordHighlight",

  addProseMirrorPlugins() {
    const { core } = this.options
    const editor = this.editor

    function computeDecorations(): DecorationSet {
      const activeId = core.audio?.activeWordId.value
      if (!activeId) return DecorationSet.empty

      const translation = core.activeChannel.value?.activeTranslation.value
      if (!translation) return DecorationSet.empty

      const doc = editor.state.doc
      let result: DecorationSet = DecorationSet.empty

      doc.forEach((node, offset) => {
        if (node.type.name !== "turn") return

        const turn = translation.turns.value.find((t) => t.id === node.attrs.id)
        if (!turn) return

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
      new Plugin({
        key: wordHighlightKey,

        state: {
          init() {
            return DecorationSet.empty
          },
          apply(tr, old) {
            if (tr.getMeta(wordHighlightKey)) return computeDecorations()
            if (tr.docChanged) return old.map(tr.mapping, tr.doc)
            return old
          },
        },

        props: {
          decorations(state) {
            return wordHighlightKey.getState(state)
          },
        },

        view() {
          // Re-déclenche le calcul des décorations dès que l'audio publie un nouveau mot actif.
          unwatch = watch(
            () => core.audio?.activeWordId.value,
            () => {
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
