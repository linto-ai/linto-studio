import { Extension } from "@tiptap/core"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import type { Node as ProseMirrorNode } from "@tiptap/pm/model"
import type { Core, TranslationStore } from "../../../core/types"
import { docToTurns } from "../utils/docToTurns"
import type { Turn, Word } from "../../../types/editor"

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
        appendTransaction(_transactions, oldState, newState) {
          if (suppressSync) return null
          if (oldState.doc.eq(newState.doc)) return null

          const translation = getTranslation()
          if (!translation) return null

          syncDocToStore(newState.doc, translation, store)
          return null
        },
      }),
    ]
  },
})

function syncDocToStore(
  doc: ProseMirrorNode,
  translation: TranslationStore,
  store: Core,
): void {
  const newTurns = docToTurns(doc)
  const oldTurns = translation.turns.value
  const oldById = new Map(oldTurns.map((t) => [t.id, t]))

  const mergedTurns = newTurns.map((newTurn) => {
    const old = oldById.get(newTurn.id)
    if (!old) return newTurn

    // Preserve words/timestamps if text hasn't changed
    const oldText = old.words.length > 0
      ? old.words.map((w: Word) => w.text).join(" ")
      : old.text ?? ""

    if (newTurn.text === oldText) {
      return { ...newTurn, words: old.words }
    }

    // Text changed: words are stale, return empty words
    return newTurn
  })

  // Detect changes and emit appropriate events
  const translationId = translation.id
  const newById = new Map(mergedTurns.map((t) => [t.id, t]))

  // Removed turns
  for (const old of oldTurns) {
    if (!newById.has(old.id)) {
      store.emit("turn:remove", { turnId: old.id, translationId })
    }
  }

  // Added or updated turns
  for (const turn of mergedTurns) {
    const old = oldById.get(turn.id)
    if (!old) {
      store.emit("turn:add", { turn, translationId })
    } else if (hasTurnChanged(old, turn)) {
      store.emit("turn:update", { turn, translationId })
    }
  }

  // Update the store silently (we already emitted the events)
  translation.turns.value = mergedTurns
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
