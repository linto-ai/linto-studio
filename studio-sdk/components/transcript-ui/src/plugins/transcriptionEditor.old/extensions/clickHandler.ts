import { Extension } from "@tiptap/core"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import type { Core } from "../../../core/types"

export interface ClickHandlerOptions {
  core: Core
}

// Rewind this many seconds before the clicked word so the user hears the lead-in.
const REWIND_SECONDS = 0.3

export const ClickHandler = Extension.create<ClickHandlerOptions>({
  name: "clickHandler",

  addProseMirrorPlugins() {
    const { core } = this.options

    return [
      new Plugin({
        key: new PluginKey("clickHandler"),
        props: {
          handleClick(view, pos) {
            const $pos = view.state.doc.resolve(pos)
            const turnNode = $pos.parent
            if (turnNode.type.name !== "turn") return false

            const turnId = turnNode.attrs.id as string | null
            if (!turnId) return false

            const translation =
              core.activeChannel.value?.activeTranslation.value
            if (!translation) return false

            const turn = translation.turns.value.find((t) => t.id === turnId)
            if (!turn) return false

            // Locate the clicked word by char offset (store words carry their
            // tokenized offsets), falling back to the turn start.
            // (parentOffset = char index within the turn's text content.)
            const charPos = $pos.parentOffset
            let target = turn.startTime
            for (const word of turn.words) {
              if (word.charStart == null || word.charEnd == null) continue
              if (charPos >= word.charStart && charPos <= word.charEnd) {
                if (word.startTime != null) target = word.startTime
                break
              }
            }

            // Pause and rewind a second before the clicked position for context.
            core.audio?.pause()
            if (target != null) {
              core.audio?.seekTo(Math.max(0, target - REWIND_SECONDS))
            }
            return false
          },
        },
      }),
    ]
  },
})
