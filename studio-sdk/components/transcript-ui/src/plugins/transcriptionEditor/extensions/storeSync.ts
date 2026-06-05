import { Extension } from "@tiptap/core"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import type { EditorState, Transaction } from "@tiptap/pm/state"
import type { Node as ProseMirrorNode } from "@tiptap/pm/model"
import { ySyncPluginKey } from "@tiptap/y-tiptap"
import type { Core, TranslationStore } from "../../../core/types"
import type { Turn } from "../../../types/editor"

const storeSyncKey = new PluginKey("storeSync")

// A legitimate edit (split/paste) introduces at most a handful of missing or
// duplicate turn ids. A larger count means corrupt data (e.g. a doubled
// document): rewriting thousands of node ids in one transaction freezes the
// tab, so the inline repair is skipped above this and fixed at the source.
const MAX_DUPLICATE_REPAIR = 100

/**
 * Flag to prevent feedback loops when the store dispatches
 * ProseMirror transactions (e.g. addTurn, setTurns).
 * When true, the storeSync plugin skips updating the store.
 */
let suppressSync = false

export function withSuppressedSync(fn: () => void): void {
  suppressSync = true
  try {
    fn()
  } finally {
    suppressSync = false
  }
}

export interface StoreSyncOptions {
  store: Core
  getTranslation: () => TranslationStore | undefined
}

export const StoreSync = Extension.create<StoreSyncOptions>({
  name: "storeSync",

  addProseMirrorPlugins() {
    const { store, getTranslation } = this.options

    return [
      new Plugin({
        key: storeSyncKey,
        appendTransaction(transactions, oldState, newState) {
          if (suppressSync) return null
          if (oldState.doc.eq(newState.doc)) return null

          // Skip fixTurnIds for remote Yjs changes:
          // - The originating client already assigned the correct ID
          // - Running fixTurnIds during _typeChanged (which holds the Yjs
          //   binding mutex) would create a PM transaction that can't sync
          //   back to Yjs, causing PM/Yjs divergence
          // - Generating a different UUID locally would create a Yjs attribute
          //   conflict with the originating client's UUID
          const isRemote = transactions.some(
            (tr) => tr.getMeta(ySyncPluginKey),
          )

          if (!isRemote) {
            const fixTr = fixTurnIds(newState)
            if (fixTr) return fixTr
          }

          const translation = getTranslation()
          if (!translation) return null

          syncDocToStore(newState.doc, oldState.doc, translation, store)
          return null
        },
      }),
    ]
  },
})

function syncDocToStore(
  newDoc: ProseMirrorNode,
  oldDoc: ProseMirrorNode,
  translation: TranslationStore,
  store: Core,
): void {
  const translationId = translation.id

  const applyTurnNode = (newNode: ProseMirrorNode): void => {
    const id = newNode.attrs.id as string
    const newTurn = nodeToTurn(newNode)
    const oldTurn = translation.getTurn(id)
    if (!oldTurn) {
      translation.updateOrCreateTurnSilent(newTurn)
      store.emit("turn:add", { turn: newTurn, translationId })
      return
    }
    const merged = mergeTurnPreservingWords(newTurn, oldTurn)
    if (hasTurnChanged(oldTurn, merged)) {
      translation.updateTurn(id, merged)
    }
  }

  // Fast path: an equal child count means edits happened in place (no
  // add/remove). ProseMirror reuses node references for unchanged subtrees, so
  // we compare children position-by-position and only touch the turns whose
  // reference actually changed — avoiding the O(n) lookup maps below on every
  // keystroke. Any structural signal (reorder / id change) bails to the full diff.
  if (oldDoc.childCount === newDoc.childCount) {
    const changedNodes: ProseMirrorNode[] = []
    let structural = false
    for (let i = 0; i < newDoc.childCount; i++) {
      const newNode = newDoc.child(i)
      const oldNode = oldDoc.child(i)
      if (newNode === oldNode) continue
      if (
        newNode.type.name !== "turn" ||
        oldNode.type.name !== "turn" ||
        newNode.attrs.id !== oldNode.attrs.id
      ) {
        structural = true
        break
      }
      changedNodes.push(newNode)
    }
    if (!structural) {
      changedNodes.forEach(applyTurnNode)
      return
    }
  }

  // Fallback: a turn was added/removed/reordered — full map-based diff.
  const oldNodesById = new Map<string, ProseMirrorNode>()
  oldDoc.forEach((node) => {
    if (node.type.name === "turn") {
      oldNodesById.set(node.attrs.id as string, node)
    }
  })

  const oldTurnsById = new Map(
    translation.turns.value.map((t) => [t.id, t]),
  )

  const newIds = new Set<string>()

  newDoc.forEach((newNode) => {
    if (newNode.type.name !== "turn") return
    const id = newNode.attrs.id as string
    newIds.add(id)

    const oldNode = oldNodesById.get(id)
    const oldTurn = oldTurnsById.get(id)

    // PM reuses node references for unchanged sub-trees
    if (oldNode === newNode && oldTurn) return

    const newTurn = nodeToTurn(newNode)

    if (!oldTurn) {
      translation.updateOrCreateTurnSilent(newTurn)
      store.emit("turn:add", { turn: newTurn, translationId })
      return
    }

    const merged = mergeTurnPreservingWords(newTurn, oldTurn)

    if (hasTurnChanged(oldTurn, merged)) {
      translation.updateTurn(id, merged)
    }
  })

  for (const [id] of oldTurnsById) {
    if (!newIds.has(id)) {
      translation.removeTurn(id)
    }
  }
}

function mergeTurnPreservingWords(
  newTurn: Turn,
  oldTurn: Turn | undefined,
): Turn {
  if (!oldTurn) return newTurn
  const oldText = oldTurn.text ?? oldTurn.words.map((w) => w.text).join(" ")
  return newTurn.text === oldText
    ? { ...newTurn, words: oldTurn.words }
    : newTurn
}

function nodeToTurn(node: ProseMirrorNode): Turn {
  return {
    id: node.attrs.id as string,
    speakerId: (node.attrs.speakerId as string) ?? null,
    text: node.textContent || null,
    words: [],
    startTime: node.attrs.startTime as number | undefined,
    endTime: node.attrs.endTime as number | undefined,
    startDate: node.attrs.startDate as number | undefined,
    endDate: node.attrs.endDate as number | undefined,
    language: (node.attrs.language as string) ?? "",
  }
}

function fixTurnIds(state: EditorState): Transaction | null {
  const seen = new Set<string>()
  // Turns whose id is missing (new/split/pasted turns default to a null id that
  // is never persisted to Yjs — which crashes the server-side docToTurns) or
  // duplicated. Both get a fresh id assigned.
  const invalid: Array<{ pos: number; attrs: Record<string, unknown> }> = []

  state.doc.forEach((node, offset) => {
    if (node.type.name !== "turn") return
    const id = node.attrs.id as string | null
    if (!id || seen.has(id)) {
      invalid.push({ pos: offset, attrs: node.attrs })
      return
    }
    seen.add(id)
  })

  if (invalid.length === 0) return null

  if (invalid.length > MAX_DUPLICATE_REPAIR) {
    console.warn(
      `[storeSync] ${invalid.length} turns with missing/duplicate ids — skipping inline repair (likely corrupt data)`,
    )
    return null
  }

  const tr = state.tr
  for (const { pos, attrs } of invalid) {
    tr.setNodeMarkup(pos, undefined, { ...attrs, id: crypto.randomUUID() })
  }
  tr.setMeta("addToHistory", false)
  return tr
}

function hasTurnChanged(a: Turn, b: Turn): boolean {
  return (
    a.text !== b.text ||
    a.speakerId !== b.speakerId ||
    a.language !== b.language ||
    a.startTime !== b.startTime ||
    a.endTime !== b.endTime ||
    a.words.length !== b.words.length
  )
}
