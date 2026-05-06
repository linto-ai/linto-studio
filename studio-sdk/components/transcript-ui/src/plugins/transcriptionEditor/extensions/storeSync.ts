import { Extension } from "@tiptap/core"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import type { EditorState, Transaction } from "@tiptap/pm/state"
import type { Node as ProseMirrorNode } from "@tiptap/pm/model"
import { ySyncPluginKey } from "@tiptap/y-tiptap"
import type { Core, TranslationStore } from "../../../core/types"
import type { Turn } from "../../../types/editor"

const storeSyncKey = new PluginKey("storeSync")

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

          // Skip fixDuplicateTurnIds for remote Yjs changes:
          // - The originating client already assigned the correct ID
          // - Running fixDuplicateTurnIds during _typeChanged (which holds the
          //   Yjs binding mutex) would create a PM transaction that can't sync
          //   back to Yjs, causing PM/Yjs divergence
          // - Generating a different UUID locally would create a Yjs attribute
          //   conflict with the originating client's UUID
          const isRemote = transactions.some(
            (tr) => tr.getMeta(ySyncPluginKey),
          )

          if (!isRemote) {
            const fixTr = fixDuplicateTurnIds(newState)
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

    // Fast path: PM reuses node references for unchanged sub-trees
    if (oldNode === newNode && oldTurn) return

    const newTurn = nodeToTurn(newNode)

    if (!oldTurn) {
      translation.updateOrCreateTurnSilent(newTurn)
      store.emit("turn:add", { turn: newTurn, translationId })
      return
    }

    // Preserve words/timestamps if text hasn't changed
    const oldText =
      oldTurn.text ?? oldTurn.words.map((w) => w.text).join(" ")
    const merged: Turn =
      newTurn.text === oldText
        ? { ...newTurn, words: oldTurn.words }
        : newTurn

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

function fixDuplicateTurnIds(state: EditorState): Transaction | null {
  const seen = new Set<string>()
  const duplicates: Array<{ pos: number; attrs: Record<string, unknown> }> = []

  state.doc.forEach((node, offset) => {
    if (node.type.name !== "turn") return
    const id = node.attrs.id as string | null
    if (!id) return
    if (seen.has(id)) {
      duplicates.push({ pos: offset, attrs: node.attrs })
    } else {
      seen.add(id)
    }
  })

  if (duplicates.length === 0) return null

  const tr = state.tr
  for (const { pos, attrs } of duplicates) {
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
