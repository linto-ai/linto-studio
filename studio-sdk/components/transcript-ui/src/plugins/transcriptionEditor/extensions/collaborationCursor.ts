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

      // One cached caret DOM per clientId. PM reuses the same node on every
      // decoration update, so appendChild at the new pos auto-detaches from
      // the old parent (DOM invariant: a node has at most one parent). Without
      // this cache, PM creates a fresh span each call and the previous one
      // can get orphaned when its host turn is destroyed by a merge.
      const cursorCache = new Map<number, HTMLElement>()

      return [
        yCursorPlugin(awareness, {
          cursorBuilder: (u, id) => buildCursor(cursorCache, u, id),
        }),
      ]
    },
  },
)

function buildCursor(
  cache: Map<number, HTMLElement>,
  user: Record<string, unknown>,
  clientId: number,
): HTMLElement {
  let cursor = cache.get(clientId)
  if (!cursor) {
    cursor = document.createElement("span")
    cursor.classList.add("collaboration-cursor__caret")
    const label = document.createElement("div")
    label.classList.add("collaboration-cursor__label")
    cursor.appendChild(label)
    cache.set(clientId, cursor)
  }
  const color = String(user.color ?? "#999")
  cursor.style.borderColor = color
  const label = cursor.firstElementChild as HTMLElement
  label.style.backgroundColor = color
  label.textContent = String(user.name ?? "Anonymous")
  return cursor
}
