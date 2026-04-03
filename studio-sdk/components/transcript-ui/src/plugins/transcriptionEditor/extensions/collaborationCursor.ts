import { Extension } from "@tiptap/core"
import { yCursorPlugin } from "@tiptap/y-tiptap"
import type { Awareness } from "y-protocols/awareness"

export interface CollaborationCursorOptions {
  awareness: Awareness
  user: Record<string, unknown>
}

export const CollaborationCursor = Extension.create<CollaborationCursorOptions>(
  {
    name: "collaborationCursor",

    addProseMirrorPlugins() {
      const { awareness, user } = this.options
      awareness.setLocalStateField("user", user)

      return [
        yCursorPlugin(awareness, {
          cursorBuilder: defaultCursorBuilder,
        }),
      ]
    },
  },
)

function defaultCursorBuilder(user: Record<string, unknown>): HTMLElement {
  const cursor = document.createElement("span")
  cursor.classList.add("collaboration-cursor__caret")
  cursor.style.borderColor = String(user.color ?? "#999")

  const label = document.createElement("div")
  label.classList.add("collaboration-cursor__label")
  label.style.backgroundColor = String(user.color ?? "#999")
  label.textContent = String(user.name ?? "Anonymous")
  cursor.appendChild(label)

  return cursor
}
