import { watch } from "vue"
import { Extension } from "@tiptap/core"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import type { Core } from "../../../core/types"

const wordHighlightKey = new PluginKey("wordHighlight")

// Mirror of the .word--active rule in TurnNodeView.vue.
const ACTIVE_STYLE =
  "text-decoration:underline;" +
  "text-decoration-color:var(--color-primary);" +
  "text-decoration-thickness:2px;" +
  "text-underline-offset:3px;" +
  "color:var(--color-primary)"

export interface WordHighlightOptions {
  core: Core
}

/**
 * Highlight the word currently being played by injecting a single CSS rule
 * targeting its `[data-wid]` span — NOT a ProseMirror decoration.
 *
 * Each word already renders as `<span data-wid>` (the `word` mark) and wids are
 * globally unique, so a one-line stylesheet `[data-wid="X"]{…}` highlights
 * exactly the active word. This deliberately avoids ProseMirror decorations:
 * an inline decoration over the marked spans raced PM's DOM reconciliation and
 * crashed updateChildren ("can't access property nextSibling, dom is null") on
 * merged/edited turns during playback. Pure CSS never dispatches a transaction
 * and never touches the desc tree, so it cannot trigger that crash.
 */
export const WordHighlight = Extension.create<WordHighlightOptions>({
  name: "wordHighlight",

  addProseMirrorPlugins() {
    const { core } = this.options

    return [
      new Plugin({
        key: wordHighlightKey,
        view(view) {
          const style = document.createElement("style")

          // The editor is created detached, then mounted into the component's
          // shadow root. A style appended at setup time would land in the
          // document head and never pierce the shadow DOM, so (re)attach it to
          // the editor's CURRENT root on every render — by playback time the
          // editor is mounted and the root is the shadow root holding the spans.
          const attach = (): void => {
            const root = view.dom.getRootNode()
            const container =
              root instanceof ShadowRoot ? root : view.dom.ownerDocument.head
            if (style.parentNode !== container) container.appendChild(style)
          }

          const render = (): void => {
            attach()
            const id = core.audio?.activeWordId.value
            style.textContent = id
              ? `[data-wid="${escapeAttr(id)}"]{${ACTIVE_STYLE}}`
              : ""
          }

          const unwatch = watch(() => core.audio?.activeWordId.value, render)
          render()

          return {
            destroy() {
              unwatch()
              style.remove()
            },
          }
        },
      }),
    ]
  },
})

// Escape for use inside a `[data-wid="…"]` attribute-value selector. wids are
// uuids (no special chars), but stay safe against quotes/backslashes.
function escapeAttr(value: string): string {
  return value.replace(/["\\]/g, "\\$&")
}
