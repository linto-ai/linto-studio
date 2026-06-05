import { Node, mergeAttributes } from "@tiptap/core"
import { splitBlockAs } from "@tiptap/pm/commands"
import { VueNodeViewRenderer } from "@tiptap/vue-3"
import TurnNodeView from "../components/TurnNodeView.vue"

// @tiptap/vue-3 adds a `selectionUpdate` listener per node view, each calling
// O(n) getPos() — O(n²) per keystroke on a long transcript. Turns don't use the
// `selected` state, so debounce that listener to run only after the user pauses.
const SELECTION_DEBOUNCE_MS = 150

interface DebouncableNodeView {
  editor?: {
    on(event: string, cb: () => void): void
    off(event: string, cb: () => void): void
  }
  handleSelectionUpdate?: () => void
  destroy?: () => void
}

function debouncedTurnNodeViewRenderer(): ReturnType<
  typeof VueNodeViewRenderer
> {
  const base = VueNodeViewRenderer(TurnNodeView)
  return (props) => {
    const nodeView = base(props)
    const nv = nodeView as unknown as DebouncableNodeView
    const editor = nv.editor
    const original = nv.handleSelectionUpdate
    if (editor && typeof original === "function") {
      editor.off("selectionUpdate", original)
      let timer: ReturnType<typeof setTimeout> | null = null
      const debounced = (): void => {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
          timer = null
          original()
        }, SELECTION_DEBOUNCE_MS)
      }
      editor.on("selectionUpdate", debounced)
      const originalDestroy = nv.destroy?.bind(nv)
      nv.destroy = (): void => {
        editor.off("selectionUpdate", debounced)
        if (timer) clearTimeout(timer)
        originalDestroy?.()
      }
    }
    return nodeView
  }
}

export interface TurnNodeAttributes {
  id: string
  speakerId: string | null
  startTime: number | undefined
  endTime: number | undefined
  startDate: number | undefined
  endDate: number | undefined
  language: string
}

export const TurnNode = Node.create({
  name: "turn",
  group: "block",
  content: "inline*",

  addAttributes() {
    return {
      id: { default: null },
      speakerId: { default: null },
      startTime: { default: undefined },
      endTime: { default: undefined },
      startDate: { default: undefined },
      endDate: { default: undefined },
      language: { default: "" },
    }
  },

  parseHTML() {
    return [{ tag: 'section[data-type="turn"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "section",
      mergeAttributes(HTMLAttributes, { "data-type": "turn" }),
      0,
    ]
  },

  addKeyboardShortcuts() {
    const splitTurn = splitBlockAs((node) => {
      if (node.type.name !== "turn") return null
      return {
        type: node.type,
        attrs: {
          ...node.attrs,
          id: crypto.randomUUID(),
          startTime: undefined,
          endTime: undefined,
        },
      }
    })

    return {
      Enter: ({ editor }) => splitTurn(editor.state, editor.view.dispatch),
    }
  },

  addNodeView() {
    return debouncedTurnNodeViewRenderer()
  },
})
