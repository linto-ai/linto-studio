import { Extension } from "@tiptap/core"
import { Plugin, PluginKey, type EditorState } from "@tiptap/pm/state"
import type { Transaction } from "@tiptap/pm/state"
import type { Slice } from "@tiptap/pm/model"
import { ySyncPluginKey } from "@tiptap/y-tiptap"
import type { Core, TurnStore } from "../../../core/types"
import { syncDocToStore } from "../utils/syncDocToStore"
import { fixTurnIds } from "../utils/fixTurnIds"
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
  /** The edited turn store — fixed for the editor's lifetime (a turn-store
   *  change always goes through a full session restart). */
  turnStore: TurnStore
  /** Who assigns/repairs turn ids. "client": this editor runs the fixTurnIds
   *  pass on local edits (local mode). "server": the server observes new turn
   *  elements and writes the id attribute — this client tolerates a
   *  transiently null id instead of writing a competing one. */
  turnIdAuthority: "client" | "server"
}

export const StoreSync = Extension.create<StoreSyncOptions>({
  name: "storeSync",

  addProseMirrorPlugins() {
    const { store, turnStore, turnIdAuthority } = this.options

    const mirror = (newState: EditorState, oldState: EditorState): void => {
      syncDocToStore(newState.doc, oldState.doc, turnStore, store)
    }

    return [
      new Plugin({
        key: storeSyncKey,
        appendTransaction(transactions, oldState, newState) {
          if (suppressSync) return null
          if (oldState.doc.eq(newState.doc)) return null

          // Re-entrancy guard. NOTE: prosemirror-state never re-invokes a
          // plugin's appendTransaction with its OWN appended transaction
          // (applyTransaction marks it as seen past its own output), so a
          // "second pass" mirror here would be unreachable dead code — the
          // guard only matters if another plugin's append chain loops back.
          if (transactions.some((tr) => tr.getMeta(NORMALIZED))) return null

          // Remote Yjs changes never enter our local undo history — just
          // mirror them. Repairing them under the Yjs mutex would diverge
          // PM/Yjs.
          const isRemote = transactions.some((tr) => tr.getMeta(ySyncPluginKey))
          if (isRemote) {
            mirror(newState, oldState)
            return null
          }

          // Local edit: repair invariants (when this client is the id
          // authority — in collab the server repairs ids), set the
          // undo-history scope, and mirror the NORMALIZED doc to the store IN
          // THIS SAME PASS (tr.doc already reflects the repair steps).
          const tr = newState.tr

          const fixTr =
            turnIdAuthority === "client" &&
            mayAffectTurnIds(transactions, oldState, newState)
              ? fixTurnIds(newState)
              : null
          if (fixTr) for (const step of fixTr.steps) tr.step(step)

          // Word/text edits are not undoable; only speaker changes (tagged)
          // are. Uniform capture keeps the yUndo stack in sync with the Y.Doc
          // — see historyPolicy.
          if (!keepsHistory(transactions)) tr.setMeta("addToHistory", false)
          tr.setMeta(NORMALIZED, true)

          syncDocToStore(tr.doc, oldState.doc, turnStore, store)

          return tr
        },
      }),
    ]
  },
})
