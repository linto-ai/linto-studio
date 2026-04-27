import { Node, mergeAttributes } from "@tiptap/core"
import { splitBlockAs } from "@tiptap/pm/commands"
import { VueNodeViewRenderer } from "@tiptap/vue-3"
import TurnNodeView from "../components/TurnNodeView.vue"

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
    return VueNodeViewRenderer(TurnNodeView)
  },
})
