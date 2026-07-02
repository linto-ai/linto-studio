import { Extension } from "@tiptap/core"
import { Plugin, PluginKey, type EditorState } from "@tiptap/pm/state"
import type { Transaction } from "@tiptap/pm/state"
import type { Slice } from "@tiptap/pm/model"
import { ySyncPluginKey } from "@tiptap/y-tiptap"
import type { Core, TranslationStore } from "../../../core/types"
import { syncDocToStore } from "../utils/syncDocToStore"
import { fixTurnIds } from "../utils/fixTurnIds"
import { fixWordMarks } from "../utils/fixWordMarks"

const storeSyncKey = new PluginKey("storeSync")

/**
 * fixTurnIds scans the whole document (O(turns)); running it on every keystroke
 * is a real cost on long transcripts. Missing/duplicate turn ids can only be
 * introduced by a change that adds or replaces a turn NODE — a pure inline text
 * edit cannot. So only run it when the turn structure could have changed: the
 * turn count differs, or a transaction inserted a slice containing a turn node
 * (covers a count-preserving paste of a copied turn).
 */
function mayAffectTurnIds(
  transactions: readonly Transaction[],
  oldState: EditorState,
  newState: EditorState,
): boolean {
  if (oldState.doc.childCount !== newState.doc.childCount) return true
  for (const tr of transactions) {
    for (const step of tr.steps) {
      const slice = (step as unknown as { slice?: Slice }).slice
      if (slice && sliceHasTurn(slice)) return true
    }
  }
  return false
}

function sliceHasTurn(slice: Slice): boolean {
  let found = false
  slice.content.forEach((node) => {
    if (node.type.name === "turn") found = true
  })
  return found
}

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

          // Repair missing/duplicate turn ids and mint wids for freshly typed
          // words on every local change before mirroring (remote changes were
          // already normalized by the originating client). Run BOTH in one
          // pass: returning the id fix early would drop this transaction's
          // changed range, so a turn edited in the same transaction that also
          // needed an id fix would never get its word marks (its typed text
          // would flush with no wid and be lost). Id fixes are attr-only and
          // word fixes are mark-only, both computed from newState — disjoint,
          // so their steps compose into one transaction.
          if (!isRemote) {
            // Only scan for id fixes when the turn structure may have changed
            // (keeps plain typing O(1) instead of O(turns) on long docs).
            const fixTr = mayAffectTurnIds(transactions, oldState, newState)
              ? fixTurnIds(newState)
              : null
            const markTr = fixWordMarks(newState, transactions)
            if (fixTr && markTr) {
              for (const step of markTr.steps) fixTr.step(step)
              return fixTr
            }
            if (fixTr) return fixTr
            if (markTr) return markTr
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
