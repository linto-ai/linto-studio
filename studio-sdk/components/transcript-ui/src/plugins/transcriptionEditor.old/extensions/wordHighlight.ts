import { watch } from "vue"
import { Extension } from "@tiptap/core"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import type { Core } from "../../../core/types"
import { activeWordRange } from "../../../utils/wordRange"

const wordHighlightKey = new PluginKey("wordHighlight")

/** Registered highlight name — styled by ::highlight(...) in karaoke.css. */
export const ACTIVE_WORD_HIGHLIGHT = "transcript-active-word"

export interface WordHighlightOptions {
  core: Core
}

/**
 * Highlight the word currently being played with the CSS Custom Highlight
 * API: a Range over the word's characters registered in CSS.highlights,
 * styled by `::highlight(transcript-active-word)`.
 *
 * ZERO nodes and ZERO decorations enter the content — the project rule "never
 * put anything inside turn content" is what ended the renderDescs crash
 * family, and a Highlight is a read-only view over existing text nodes. The
 * doc being plain text, the word is located by store char offsets (see
 * wordRange.ts). Unsupported browsers simply get no karaoke highlight.
 */
export const WordHighlight = Extension.create<WordHighlightOptions>({
  name: "wordHighlight",

  addProseMirrorPlugins() {
    const { core } = this.options

    return [
      new Plugin({
        key: wordHighlightKey,
        view(view) {
          const supported =
            typeof CSS !== "undefined" && "highlights" in CSS
          if (!supported) return {}

          // The registry is DOCUMENT-global while this plugin view is
          // per-editor: only ever delete the entry when it is the one THIS
          // instance registered, or a dying editor (session restart, crash
          // rebuild, second web component) would clobber the live one's
          // highlight.
          let current: Highlight | null = null
          const clear = (): void => {
            if (current && CSS.highlights.get(ACTIVE_WORD_HIGHLIGHT) === current) {
              CSS.highlights.delete(ACTIVE_WORD_HIGHLIGHT)
            }
            current = null
          }

          const render = (): void => {
            const id = core.audio?.activeWordId.value
            const range = id ? activeWordRange(view.dom, core, id) : null
            if (range) {
              current = new Highlight(range)
              CSS.highlights.set(ACTIVE_WORD_HIGHLIGHT, current)
            } else {
              clear()
            }
          }

          const unwatch = watch(() => core.audio?.activeWordId.value, render)
          render()

          return {
            // Re-resolve after every editor update: a doc change can replace
            // the text nodes the current Range points into.
            update: render,
            destroy() {
              unwatch()
              clear()
            },
          }
        },
      }),
    ]
  },
})
