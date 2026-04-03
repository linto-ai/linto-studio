import { watchEffect } from "vue"
import { Extension } from "@tiptap/core"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import { Decoration, DecorationSet } from "@tiptap/pm/view"
import type { Core } from "../../../core/types"
import { findActiveWord, hasWordTimestamps } from "../../../utils/words"

const wordHighlightKey = new PluginKey("wordHighlight")

export interface WordHighlightOptions {
  core: Core
}

export const WordHighlight = Extension.create<WordHighlightOptions>({
  name: "wordHighlight",

  addProseMirrorPlugins() {
    const { core } = this.options
    const editor = this.editor

    let currentWordId: string | null = null

    function computeDecorations(): DecorationSet {
      if (!core.audio?.isPlaying.value) return DecorationSet.empty

      const time = core.audio.currentTime.value
      const translation =
        core.activeChannel.value?.activeTranslation.value
      if (!translation) return DecorationSet.empty

      const doc = editor.state.doc
      let result: DecorationSet = DecorationSet.empty

      doc.forEach((node, offset) => {
        if (node.type.name !== "turn") return

        const turn = translation.turns.value.find(
          (t) => t.id === node.attrs.id,
        )
        if (!turn || !hasWordTimestamps(turn.words)) return

        const { startTime, endTime } = turn
        if (startTime == null || endTime == null) return
        if (time < startTime || time > endTime) return

        const activeId = findActiveWord(turn.words, time)
        if (!activeId) return

        // Find character offset of the active word in the node text
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

    // Watch currentTime changes and dispatch a meta-only transaction
    // only when the active word actually changes
    let rafId: number | null = null
    let isPlaying = false

    function tick() {
      if (!isPlaying) return

      const time = core.audio!.currentTime.value
      const translation =
        core.activeChannel.value?.activeTranslation.value
      let newWordId: string | null = null

      if (translation) {
        for (const turn of translation.turns.value) {
          if (
            turn.startTime != null &&
            turn.endTime != null &&
            time >= turn.startTime &&
            time <= turn.endTime &&
            hasWordTimestamps(turn.words)
          ) {
            newWordId = findActiveWord(turn.words, time)
            break
          }
        }
      }

      if (newWordId !== currentWordId) {
        currentWordId = newWordId
        // Dispatch a meta-only transaction to trigger decoration recalc
        const tr = editor.state.tr.setMeta(wordHighlightKey, true)
        editor.view.dispatch(tr)
      }

      rafId = requestAnimationFrame(tick)
    }

    function startLoop() {
      if (isPlaying) return
      isPlaying = true
      rafId = requestAnimationFrame(tick)
    }

    function stopLoop() {
      isPlaying = false
      if (rafId != null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
      if (currentWordId !== null) {
        currentWordId = null
        const tr = editor.state.tr.setMeta(wordHighlightKey, true)
        editor.view.dispatch(tr)
      }
    }

    // Vue watch → plain effect via core.audio reactivity
    let unwatchPlaying: (() => void) | null = null

    return [
      new Plugin({
        key: wordHighlightKey,

        state: {
          init() {
            return DecorationSet.empty
          },
          apply(tr, old) {
            if (tr.getMeta(wordHighlightKey)) {
              return computeDecorations()
            }
            if (tr.docChanged) {
              return old.map(tr.mapping, tr.doc)
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
          unwatchPlaying = watchEffect(() => {
            if (core.audio?.isPlaying.value) {
              startLoop()
            } else {
              stopLoop()
            }
          })

          return {
            destroy() {
              unwatchPlaying?.()
              stopLoop()
            },
          }
        },
      }),
    ]
  },
})
