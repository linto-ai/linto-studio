import { Extension } from "@tiptap/core"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import type { EditorView } from "@tiptap/pm/view"
import {
  ySyncPluginKey,
  absolutePositionToRelativePosition,
  relativePositionToAbsolutePosition,
} from "@tiptap/y-tiptap"
import type { Doc, XmlFragment } from "yjs"
import {
  createRelativePositionFromJSON,
  compareRelativePositions,
} from "yjs"
import type { Awareness } from "y-protocols/awareness"

export interface CollaborationCursorOptions {
  awareness: Awareness
  user: Record<string, unknown>
}

const remoteCursorOverlayKey = new PluginKey("remoteCursorOverlay")

/**
 * Remote carets and selections rendered as an absolutely-positioned OVERLAY
 * outside the contenteditable — never as ProseMirror decorations.
 *
 * This replaces y-tiptap's yCursorPlugin, which injects a caret widget and an
 * inline selection decoration INSIDE turn content. With the span-per-word
 * structure (word spans separated by bare whitespace text nodes), any foreign
 * node between words desyncs updateChildren's DOM walk and crashes renderDescs
 * (rm(null), "Cannot read properties of null (reading 'nextSibling')") when a
 * word at the caret gets re-rendered. Flight-recorder proven twice: first with
 * a cached caret span moved by appendChild, then AGAIN with fresh elements per
 * redraw — the crash needs only a widget sitting between word spans while the
 * user types there. Same failure family that forced wordHighlight to pure CSS.
 *
 * The awareness protocol is unchanged (same `cursor` field, relative-position
 * JSON), so this client stays wire-compatible with peers running yCursorPlugin.
 */
export const CollaborationCursor = Extension.create<CollaborationCursorOptions>(
  {
    name: "collaborationCursor",

    addProseMirrorPlugins() {
      const { awareness, user } = this.options
      awareness.setLocalStateField("user", user)

      return [
        new Plugin({
          key: remoteCursorOverlayKey,
          view: (view) => new RemoteCursorOverlay(view, awareness),
        }),
      ]
    },
  },
)

/** Shape of ySyncPlugin's state we rely on (not exported by y-tiptap). */
interface YSyncState {
  doc: Doc
  type: XmlFragment
  binding: { mapping: unknown } | null
  snapshot: unknown
  prevSnapshot: unknown
}

interface RemoteCursor {
  clientId: number
  name: string
  color: string
  anchor: number
  head: number
}

/** Rendering more selection rects than this (huge remote select-all on a long
 *  transcript) is invisible noise below the fold — cap the DOM cost. */
const MAX_SELECTION_RECTS = 200

class RemoteCursorOverlay {
  private readonly view: EditorView
  private readonly awareness: Awareness
  private readonly overlay: HTMLElement
  private rafHandle: number | null = null

  private readonly onAwarenessChange = (): void => this.schedule()
  private readonly onFocusChange = (): void => {
    this.publishLocalCursor()
    this.schedule()
  }

  constructor(view: EditorView, awareness: Awareness) {
    this.view = view
    this.awareness = awareness

    this.overlay = document.createElement("div")
    this.overlay.className = "collaboration-cursor__overlay"

    awareness.on("change", this.onAwarenessChange)
    view.dom.addEventListener("focusin", this.onFocusChange)
    view.dom.addEventListener("focusout", this.onFocusChange)
    this.schedule()
  }

  /**
   * Keep the overlay attached to view.dom's CURRENT parent, and make that
   * parent the containing block. Must run at render time, not construction:
   * the editor is created detached and EditorContent later MOVES view.dom
   * (and its siblings) into its own div — an overlay attached (and a
   * position:relative applied) at construction would target the discarded
   * original parent, leaving the scroll container as containing block and
   * clipping every caret below the first viewport (inset:0 + overflow
   * hidden).
   */
  private ensureAttached(): boolean {
    const parent = this.view.dom.parentElement
    if (!parent) return false
    if (this.overlay.parentElement !== parent) parent.appendChild(this.overlay)
    if (getComputedStyle(parent).position === "static") {
      parent.style.position = "relative"
    }
    return true
  }

  /** PluginView hook: runs after every dispatched transaction — keeps the
   *  published local cursor and the remote overlay in sync with reflows. */
  update(): void {
    this.publishLocalCursor()
    this.schedule()
  }

  destroy(): void {
    if (this.rafHandle !== null) cancelAnimationFrame(this.rafHandle)
    this.awareness.off("change", this.onAwarenessChange)
    this.view.dom.removeEventListener("focusin", this.onFocusChange)
    this.view.dom.removeEventListener("focusout", this.onFocusChange)
    this.awareness.setLocalStateField("cursor", null)
    this.overlay.remove()
  }

  /** Coalesce renders: awareness churns on every keystroke of every peer, and
   *  positioning reads layout (coordsAtPos) — one paint per frame is enough. */
  private schedule(): void {
    if (this.rafHandle !== null) return
    this.rafHandle = requestAnimationFrame(() => {
      this.rafHandle = null
      this.render()
    })
  }

  // ── Publishing (same wire format as yCursorPlugin) ─────────────────────

  private publishLocalCursor(): void {
    const ystate = this.syncState()
    if (!ystate?.binding) return
    const current = (this.awareness.getLocalState() ?? {}) as {
      cursor?: { anchor: unknown; head: unknown } | null
    }

    if (this.view.hasFocus()) {
      const selection = this.view.state.selection
      const anchor = absolutePositionToRelativePosition(
        selection.anchor,
        ystate.type,
        ystate.binding.mapping as never,
      )
      const head = absolutePositionToRelativePosition(
        selection.head,
        ystate.type,
        ystate.binding.mapping as never,
      )
      if (
        current.cursor == null ||
        !compareRelativePositions(
          createRelativePositionFromJSON(current.cursor.anchor),
          anchor,
        ) ||
        !compareRelativePositions(
          createRelativePositionFromJSON(current.cursor.head),
          head,
        )
      ) {
        this.awareness.setLocalStateField("cursor", { anchor, head })
      }
    } else if (
      current.cursor != null &&
      relativePositionToAbsolutePosition(
        ystate.doc,
        ystate.type,
        createRelativePositionFromJSON(current.cursor.anchor),
        ystate.binding.mapping as never,
      ) !== null
    ) {
      // Only clear cursor info this binding owns (still resolvable here).
      this.awareness.setLocalStateField("cursor", null)
    }
  }

  // ── Rendering ──────────────────────────────────────────────────────────

  private render(): void {
    if (!this.ensureAttached()) return
    const cursors = this.remoteCursors()
    const parentRect = this.overlay.getBoundingClientRect()
    const nodes: HTMLElement[] = []
    for (const cursor of cursors) {
      this.renderSelection(cursor, parentRect, nodes)
      this.renderCaret(cursor, parentRect, nodes)
    }
    this.overlay.replaceChildren(...nodes)
  }

  private remoteCursors(): RemoteCursor[] {
    const ystate = this.syncState()
    if (!ystate?.binding) return []
    // Cursors are meaningless while a snapshot view replaces the live doc.
    if (ystate.snapshot != null || ystate.prevSnapshot != null) return []

    const cursors: RemoteCursor[] = []
    const docSize = this.view.state.doc.content.size
    this.awareness.getStates().forEach((state, clientId) => {
      if (clientId === this.awareness.clientID) return
      const aw = state as {
        cursor?: { anchor: unknown; head: unknown } | null
        user?: { name?: string; color?: string }
      }
      if (aw.cursor == null) return
      const anchor = this.resolvePosition(ystate, aw.cursor.anchor, docSize)
      const head = this.resolvePosition(ystate, aw.cursor.head, docSize)
      if (anchor === null || head === null) return
      cursors.push({
        clientId,
        name: aw.user?.name ?? `User ${clientId}`,
        color: aw.user?.color ?? "#999",
        anchor,
        head,
      })
    })
    return cursors
  }

  private resolvePosition(
    ystate: YSyncState,
    relJson: unknown,
    docSize: number,
  ): number | null {
    try {
      const abs = relativePositionToAbsolutePosition(
        ystate.doc,
        ystate.type,
        createRelativePositionFromJSON(relJson),
        ystate.binding!.mapping as never,
      )
      if (abs === null) return null
      return Math.max(0, Math.min(abs, docSize))
    } catch {
      return null
    }
  }

  private renderCaret(
    cursor: RemoteCursor,
    parentRect: DOMRect,
    nodes: HTMLElement[],
  ): void {
    let coords: { left: number; top: number; bottom: number }
    try {
      coords = this.view.coordsAtPos(cursor.head)
    } catch {
      return
    }
    const caret = document.createElement("div")
    caret.className = "collaboration-cursor__caret"
    caret.style.borderColor = cursor.color
    caret.style.left = `${coords.left - parentRect.left}px`
    caret.style.top = `${coords.top - parentRect.top}px`
    caret.style.height = `${coords.bottom - coords.top}px`

    const label = document.createElement("div")
    label.className = "collaboration-cursor__label"
    label.style.backgroundColor = cursor.color
    label.textContent = cursor.name
    caret.appendChild(label)
    nodes.push(caret)
  }

  private renderSelection(
    cursor: RemoteCursor,
    parentRect: DOMRect,
    nodes: HTMLElement[],
  ): void {
    const from = Math.min(cursor.anchor, cursor.head)
    const to = Math.max(cursor.anchor, cursor.head)
    if (from === to) return
    let rects: DOMRectList
    try {
      const start = this.view.domAtPos(from)
      const end = this.view.domAtPos(to)
      const range = document.createRange()
      range.setStart(start.node, start.offset)
      range.setEnd(end.node, end.offset)
      rects = range.getClientRects()
    } catch {
      return
    }
    const count = Math.min(rects.length, MAX_SELECTION_RECTS)
    for (let i = 0; i < count; i++) {
      const rect = rects[i]
      if (!rect || rect.width === 0 || rect.height === 0) continue
      const box = document.createElement("div")
      box.className = "collaboration-cursor__selection"
      box.style.backgroundColor = cursor.color
      box.style.left = `${rect.left - parentRect.left}px`
      box.style.top = `${rect.top - parentRect.top}px`
      box.style.width = `${rect.width}px`
      box.style.height = `${rect.height}px`
      nodes.push(box)
    }
  }

  private syncState(): YSyncState | null {
    return (ySyncPluginKey.getState(this.view.state) as YSyncState | null) ?? null
  }
}
