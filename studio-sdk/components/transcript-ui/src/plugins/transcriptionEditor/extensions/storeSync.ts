import { Extension } from "@tiptap/core"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import { ySyncPluginKey } from "@tiptap/y-tiptap"
import type { Core, TranslationStore } from "../../../core/types"
import { syncDocToStore } from "../utils/syncDocToStore"
import { fixTurnIds } from "../utils/fixTurnIds"

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

          // Skip on remote Yjs changes: the originating client already set the
          // id, and reassigning under the Yjs mutex would diverge PM/Yjs.
          const isRemote = transactions.some((tr) => tr.getMeta(ySyncPluginKey))

          // Repair missing/duplicate ids on every local change before mirroring.
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
