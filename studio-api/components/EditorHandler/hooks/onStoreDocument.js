const debug = require("debug")(
  "linto:components:EditorHandler:onStoreDocument",
)
const Y = require("yjs")

const model = require(`${process.cwd()}/lib/mongodb/models`)
const { docToSpeakers } = require("../schema/docToSpeakers")
const { SCHEMA_GEN } = require("../schema/generation")
const { speakersChanged } = require("../flush/speakersDiff")
const { getSyllabic } = require("../../EditorHandler2/utils/syllabic")
const { parseDocumentName } = require("../utils/parseDocumentName")
const { buildWordsPayload } = require("../utils/buildWordsPayload")

const EMPTY_WORDS = []

// Element-wise word comparison (word text + timing). The WordsState
// serializes fresh arrays every flush, so reference comparison is gone —
// O(words) per flush at the store debounce cadence is negligible.
function wordsDiffer(a = EMPTY_WORDS, b = EMPTY_WORDS) {
  if (a.length !== b.length) return true
  for (let i = 0; i < a.length; i++) {
    if (
      a[i].word !== b[i].word ||
      a[i].stime !== b[i].stime ||
      a[i].etime !== b[i].etime
    ) {
      return true
    }
  }
  return false
}

function turnPersistDiffers(a, b) {
  return (
    (a.segment ?? "") !== (b.segment ?? "") ||
    (a.raw_segment ?? "") !== (b.raw_segment ?? "") ||
    (a.speaker_id ?? null) !== (b.speaker_id ?? null) ||
    (a.language ?? "") !== (b.language ?? "") ||
    wordsDiffer(a.words, b.words)
  )
}

// Turns to update in place (by turn_id) when the set/order is unchanged; null
// when the structure changed (add/remove/reorder) so the array must be rewritten.
function inPlaceDirtyTurns(oldTurns, newTurns) {
  if (oldTurns.length !== newTurns.length) return null
  const seen = new Set()
  const dirty = []
  for (let i = 0; i < newTurns.length; i++) {
    const id = newTurns[i].turn_id
    // Missing/duplicate id → arrayFilter on text.$[elem] is ambiguous; rewrite all.
    if (!id || seen.has(id)) return null
    seen.add(id)
    if (oldTurns[i].turn_id !== id) return null
    if (turnPersistDiffers(oldTurns[i], newTurns[i])) dirty.push(newTurns[i])
  }
  return dirty
}

// True when an epoch-guarded write did not fully apply: the conversation
// was rewritten outside the editor (epoch bumped) — this doc's lineage is
// dead. Close its connections; clients reconnect, get the stale-epoch
// rejection at auth, refetch and rebuild on the new lineage.
function staleFlush(result, expectedMatches, documentName, closeConnections) {
  if (
    typeof result?.matchedCount === "number" &&
    result.matchedCount >= expectedMatches
  ) {
    return false
  }
  debug(
    `onStoreDocument: stale epoch doc=${documentName} (matched=${result?.matchedCount}), closing connections`,
  )
  try {
    closeConnections(documentName)
  } catch (err) {
    debug(`closeConnections failed for doc=${documentName}: ${err.message}`)
  }
  return true
}

async function onStoreDocument({ document, documentName }, closeConnections) {
  const parsed = parseDocumentName(documentName)
  if (!parsed) return
  const { conversationId } = parsed
  const epoch = document.lintoEpoch ?? 0

  // Fresh read from Mongo: cross-instance source of truth for words+timestamps.
  // Protected by Hocuspocus extension-redis Redlock — only one instance per doc.
  const conversation = await model.conversations.getById(conversationId, [
    "text",
    "speakers",
  ])
  if (!conversation || conversation.length !== 1) {
    debug(`onStoreDocument: doc=${documentName} not found`)
    return
  }
  const oldTurns = conversation[0].text || []
  const oldSpeakers = (conversation[0].speakers || []).map((s) => ({
    speaker_id: s.speaker_id,
    speaker_name: s.speaker_name,
  }))

  const wordsState = document.lintoWords
  if (!wordsState) {
    debug(`onStoreDocument: doc=${documentName} has no WordsState, skipping`)
    return
  }

  // Synchronous block: the retime, the serialized turns, the speakers and
  // the binary state are all extracted from the exact same Y.Doc snapshot
  // (no await in between), so the persisted state never lags behind the
  // turns written below. The retime is the debounced path of the
  // WordsState: re-tokenize the dirty turns, re-time them (retimeTurn),
  // and hand back the changed turns for the broadcast.
  const changedTurns = wordsState.hasDirty() ? wordsState.retimeDirty(getSyllabic) : []
  const finalTurns = wordsState.serialize()
  const newSpeakers = docToSpeakers(document)
  const yState = Buffer.from(Y.encodeStateAsUpdate(document))

  // Persist-visible changes only: a retime whose result is byte-identical
  // to Mongo (edit-then-revert within the debounce, hydrate-dirty no-op)
  // must not trigger a full rewrite of a 1h+ conversation.
  const hasChanges =
    oldTurns.length !== finalTurns.length ||
    finalTurns.some((t, i) => turnPersistDiffers(oldTurns[i], t))
  const speakersDirty = speakersChanged(oldSpeakers, newSpeakers)

  try {
    // Persist the CRDT state BEFORE the domain writes: the invariant
    // "state >= text" must hold, otherwise a crash window would reload an
    // older state and the next flush would regress already-persisted text.
    // The state is tagged with the doc's epoch: if an external write bumped
    // the epoch meanwhile, this write is inert (ignored at load time).
    const stateResult = await model.editorStates.set(
      conversationId,
      epoch,
      yState,
      SCHEMA_GEN,
    )
    if (typeof stateResult?.matchedCount !== "number") {
      // State write failed: abort the flush, Mongo keeps the previous
      // consistent (state, text) pair. Edits stay in the live doc.
      console.error(
        `Flush aborted for doc=${documentName}: editor state write failed`,
      )
      return
    }

    if (!hasChanges && !speakersDirty) return

    let writeMode = "none"
    if (hasChanges) {
      const dirtyTurns = inPlaceDirtyTurns(oldTurns, finalTurns)
      if (
        dirtyTurns &&
        dirtyTurns.length > 0 &&
        dirtyTurns.length * 2 <= finalTurns.length
      ) {
        // Few turns changed, structure intact: update just those in place.
        const result = await model.conversations.updateTurnsByIds(
          conversationId,
          dirtyTurns,
          epoch,
        )
        if (
          staleFlush(result, dirtyTurns.length + 1, documentName, closeConnections)
        )
          return
        writeMode = `targeted(${dirtyTurns.length}/${finalTurns.length})`
      } else {
        // Structure changed or most turns touched: rewrite the whole array.
        const result = await model.conversations.replaceTurns(
          conversationId,
          finalTurns,
          epoch,
        )
        if (staleFlush(result, 1, documentName, closeConnections)) return
        writeMode = `full(${finalTurns.length})`
      }
    }
    if (speakersDirty) {
      const result = await model.conversations.updateSpeakers(
        conversationId,
        newSpeakers,
        epoch,
      )
      if (staleFlush(result, 1, documentName, closeConnections)) return
    }

    debug(
      `Flushed doc=${documentName}: ${writeMode} changed=${changedTurns.length} speakers=${speakersDirty ? "Y" : "N"}`,
    )

    // Broadcast only turns whose timings actually moved vs Mongo — a
    // retimed-but-identical turn is noise for every connected client.
    const oldTurnsById = new Map(oldTurns.map((t) => [t.turn_id, t]))
    const broadcastTurns = buildWordsPayload(changedTurns).filter((t) => {
      const old = oldTurnsById.get(t.turn_id)
      return !old || wordsDiffer(old.words, t.words)
    })
    if (broadcastTurns.length > 0) {
      try {
        document.broadcastStateless(
          JSON.stringify({
            type: "timestamps_recalc",
            turns: broadcastTurns,
          }),
        )
      } catch (err) {
        debug(
          `broadcastStateless failed for doc=${documentName}: ${err.message}`,
        )
      }
    }
  } catch (err) {
    // A DB write failure throws here: abort this flush but keep the live doc
    // and its connections — edits stay in the Y.Doc and the next debounced
    // flush retries. Only a genuine epoch miss (matchedCount === 0) closes
    // connections, via staleFlush. The model write methods must therefore
    // throw on error, never return it (a returned Error has no matchedCount
    // and would be misread by staleFlush as a dead lineage).
    console.error(`Flush failed for doc=${documentName}:`, err)
  }
}

module.exports = { onStoreDocument }
