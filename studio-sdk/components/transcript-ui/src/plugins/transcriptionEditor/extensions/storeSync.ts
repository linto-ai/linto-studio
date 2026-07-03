import { Extension } from "@tiptap/core"
import { Plugin, PluginKey, type EditorState } from "@tiptap/pm/state"
import type { Transaction } from "@tiptap/pm/state"
import type { Slice } from "@tiptap/pm/model"
import { ySyncPluginKey } from "@tiptap/y-tiptap"
import type { Core, TranslationStore } from "../../../core/types"
import { syncDocToStore } from "../utils/syncDocToStore"
import { fixTurnIds } from "../utils/fixTurnIds"
import { fixWordMarks } from "../utils/fixWordMarks"
import { keepsHistory } from "../utils/historyPolicy"

const storeSyncKey = new PluginKey("storeSync")

// Marks storeSync's own follow-up transaction. When it comes back around, the
// repairs are already in the doc, so we mirror to the store instead of
// reprocessing (see appendTransaction).
const NORMALIZED = "transcriptionEditor/storeSyncNormalized"

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

    const mirror = (newState: EditorState, oldState: EditorState): void => {
      const translation = getTranslation()
      if (translation) {
        syncDocToStore(newState.doc, oldState.doc, translation, store)
      }
    }

    return [
      new Plugin({
        key: storeSyncKey,
        appendTransaction(transactions, oldState, newState) {
          if (suppressSync) return null
          if (oldState.doc.eq(newState.doc)) return null

          // Second pass: our own follow-up (repairs + history flag) has been
          // applied, so the doc is normalized — mirror it and stop. Deferring
          // the mirror to here matters: the store seeds its words from the doc's
          // wids, which only exist once the repair marks are applied.
          if (transactions.some((tr) => tr.getMeta(NORMALIZED))) {
            mirror(newState, oldState)
            return null
          }

          // Remote Yjs changes are already normalized by their origin client and
          // never enter our local undo history — just mirror them. Repairing
          // them under the Yjs mutex would diverge PM/Yjs.
          const isRemote = transactions.some((tr) => tr.getMeta(ySyncPluginKey))
          if (isRemote) {
            mirror(newState, oldState)
            return null
          }

          // First pass on a local edit: repair the invariants and set the
          // undo-history scope in ONE follow-up transaction.
          const tr = newState.tr

          // Repair missing/duplicate turn ids and mint wids for freshly typed
          // words. Both are computed from newState and disjoint (id fixes are
          // attr-only, word fixes are mark-only), so their steps compose into
          // this one transaction. Only scan for id fixes when the turn structure
          // may have changed (keeps plain typing O(1), not O(turns), on long docs).
          const fixTr = mayAffectTurnIds(transactions, oldState, newState)
            ? fixTurnIds(newState)
            : null
          if (fixTr) for (const step of fixTr.steps) tr.step(step)
          const markTr = fixWordMarks(newState, transactions)
          if (markTr) for (const step of markTr.steps) tr.step(step)

          // Word/text edits are not undoable; only speaker changes (tagged) are.
          // Uniform capture keeps the yUndo stack in sync with the Y.Doc — see
          // historyPolicy.
          if (!keepsHistory(transactions)) tr.setMeta("addToHistory", false)
          tr.setMeta(NORMALIZED, true)
          // A mark-repair step clears the transaction's stored marks. Without
          // restoring them, the inclusive `word` mark wouldn't carry to the next
          // keystroke — visible only when editing the LAST word of a turn, where
          // there's no following text to infer the mark from, so the next letter
          // lands unmarked in a stray empty span. Keep the mark cursor the base
          // edit established.
          tr.setStoredMarks(newState.storedMarks)
          return tr
        },
      }),
    ]
  },
})
