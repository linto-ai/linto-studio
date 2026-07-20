import type { Node as ProseMirrorNode } from "@tiptap/pm/model"
import type { Core, TurnStore } from "../../../core/types"
import type { Turn } from "../../../types/editor"
import { nodeToTurn } from "./nodeToTurn"
import { mergeTurnPreservingWords } from "./mergeTurnPreservingWords"
import { hasTurnChanged } from "./hasTurnChanged"

/**
 * Mirror a ProseMirror document change into the turn store.
 *
 * Fast path (equal child count, same ids in place): edit only the changed turns
 * in place. Fallback (a turn was added/removed/reordered): rebuild the store
 * array in document order so every consumer that reads turns.value positionally
 * stays aligned with the PM/Yjs doc.
 */
export function syncDocToStore(
  newDoc: ProseMirrorNode,
  oldDoc: ProseMirrorNode,
  turnStore: TurnStore,
  store: Core,
): void {
  const translationId = turnStore.id

  const applyTurnNode = (newNode: ProseMirrorNode): void => {
    const id = newNode.attrs.id as string | null
    // A turn without an id is waiting for the server-assigned one (fresh split);
    // it enters the store when the id attribute lands (next transaction).
    if (!id) return
    const newTurn = nodeToTurn(newNode)
    const oldTurn = turnStore.getTurn(id)
    if (!oldTurn) {
      turnStore.updateOrCreateTurnSilent(newTurn)
      store.emit("turn:add", { turn: newTurn, translationId })
      return
    }
    const merged = mergeTurnPreservingWords(newTurn, oldTurn)
    if (hasTurnChanged(oldTurn, merged)) {
      turnStore.updateTurn(id, merged)
    }
  }

  // Fast path: equal child count → edits in place. PM reuses node refs for
  // unchanged subtrees, so compare by reference and touch only changed turns;
  // any structural signal bails to the full diff below.
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

  // Fallback: a turn was added, removed or reordered. Rebuild the store array in
  // document order so every consumer that reads turns.value positionally — the
  // LocalSession re-seed (turnsToDoc), the cross-translation store,
  // follow-playback and the non-collab panels — matches the PM/Yjs doc. The old
  // code appended new turns to the end and never reordered, so a mid-document
  // split or paste left turns.value permanently out of order.
  const oldNodesById = new Map<string, ProseMirrorNode>()
  oldDoc.forEach((node) => {
    if (node.type.name === "turn") {
      oldNodesById.set(node.attrs.id as string, node)
    }
  })

  const oldTurnsById = new Map(turnStore.turns.value.map((t) => [t.id, t]))

  const orderedTurns: Turn[] = []
  const added: Turn[] = []
  const updated: Turn[] = []
  const newIds = new Set<string>()

  newDoc.forEach((newNode) => {
    if (newNode.type.name !== "turn") return
    const id = newNode.attrs.id as string | null
    // Not yet identified (server-assigned id in flight): keep it out of the
    // store until the id attribute lands.
    if (!id) return
    newIds.add(id)

    const oldNode = oldNodesById.get(id)
    const oldTurn = oldTurnsById.get(id)

    // PM reuses node references for unchanged sub-trees: keep the stored turn
    // (and its words/timestamps) untouched, only at its new position.
    if (oldNode === newNode && oldTurn) {
      orderedTurns.push(oldTurn)
      return
    }

    const newTurn = nodeToTurn(newNode)

    if (!oldTurn) {
      orderedTurns.push(newTurn)
      added.push(newTurn)
      return
    }

    const merged = mergeTurnPreservingWords(newTurn, oldTurn)
    orderedTurns.push(merged)
    if (hasTurnChanged(oldTurn, merged)) updated.push(merged)
  })

  const removed: string[] = []
  for (const [id] of oldTurnsById) {
    if (!newIds.has(id)) removed.push(id)
  }

  // One silent reorder/replace (no translation:sync → no warnUnsupported),
  // then granular events so listeners react exactly as with the old per-turn path.
  turnStore.replaceTurns(orderedTurns)
  for (const turn of added) store.emit("turn:add", { turn, translationId })
  for (const turn of updated) store.emit("turn:update", { turn, translationId })
  for (const turnId of removed) store.emit("turn:remove", { turnId, translationId })
}
