const { getSyllabic } = require("../words/syllabic")
const { interpolateWordTimes } = require("../words/interpolate")
const debug = require("debug")("linto:components:EditorHandler:enrichDiff")
debug.inspectOpts.depth = null
debug.inspectOpts.maxArrayLength = null

/**
 * Build the full new turns[] (ordered as in the Y.Doc, with timestamps) by
 * mapping each doc word to the last-flushed Mongo state BY wid.
 *
 * Word identity now lives in the doc (the `word` mark carries the wid), so this
 * is a pure identity mapping — no text-diff, no split/merge detection:
 *  - wid known & text unchanged → keep the old timestamp verbatim (anchor).
 *  - wid known & text changed (mid-word split, typo, glued merge) → the old
 *    span becomes a redistribution budget, filled by syllables.
 *  - wid unknown (client-generated new word) → interpolate from neighbours.
 *  - old wid absent from the doc → dropped.
 * Turn merge/split falls out for free: a word keeps its timestamp regardless of
 * which turn node now holds its wid.
 *
 * @returns {{
 *   finalTurns: Array,           // ordered, ready to $set Mongo
 *   changedTurns: Array<{ turn_id: string, words: Array }>,  // for stateless broadcast
 *   hasChanges: boolean,
 * }}
 */
function enrichDiff(oldTurns, newTurns) {
  // wid is globally unique, so index every old word by wid regardless of turn.
  // Keep the FIRST word for a given wid: a duplicate wid (client id-generation
  // collision, or a copy/paste of a marked run before the client reconciles)
  // must not silently remap an earlier word's timing onto a later one.
  const oldWordByWid = new Map()
  const oldTurnById = new Map()
  for (const t of oldTurns) {
    oldTurnById.set(t.turn_id, t)
    for (const w of t.words || []) {
      if (w.wid && !oldWordByWid.has(w.wid)) oldWordByWid.set(w.wid, w)
    }
  }

  // A wid may be consumed at most once across the whole flush (guards against a
  // duplicate wid in the doc mapping two doc words onto the same old timing).
  const claimedWids = new Set()
  const changedTurns = []
  let dirty = false

  const finalTurns = newTurns.map((nt) => {
    const oldTurn = oldTurnById.get(nt.turn_id)
    const syllabic = getSyllabic(nt.language || (oldTurn && oldTurn.language))

    // Text-fallback pool: this turn's old words, consumed in order by matching
    // text when a doc word's wid is unknown. Legacy transcripts have Mongo words
    // with NO wid, so the reseed generates fresh wids that can't match by id — this
    // recovers their real timing by text instead of destroying it by
    // interpolating over the whole turn span.
    const oldWords = (oldTurn && oldTurn.words) || []
    const textConsumed = new Set()
    // Precompute O(1) lookups so the per-word mapping stays O(W) per turn (a
    // per-word indexOf/scan would be O(W^2), heavy on long turns): old word
    // reference -> index, and text -> indices of TIMED old words (for the
    // legacy text-fallback).
    const oldIndexByRef = new Map()
    const oldTimedByText = new Map()
    for (let i = 0; i < oldWords.length; i++) {
      const ow = oldWords[i]
      oldIndexByRef.set(ow, i)
      if (ow.stime != null) {
        const q = oldTimedByText.get(ow.word)
        if (q) q.push(i)
        else oldTimedByText.set(ow.word, [i])
      }
    }

    const words = nt.words.map((nw) => {
      const old =
        nw.wid && !claimedWids.has(nw.wid) ? oldWordByWid.get(nw.wid) : undefined
      if (old) {
        claimedWids.add(nw.wid)
        // Also consume it from the text pool so a duplicate wid can't recover
        // the same old timing twice.
        const oi = oldIndexByRef.get(old)
        if (oi !== undefined) textConsumed.add(oi)
        // Anchor: identity + text unchanged → keep exact timing verbatim.
        if (old.word === nw.word) return { ...old, word: nw.word }
        // Known wid, text changed → old span is a redistribution budget.
        return {
          wid: nw.wid,
          word: nw.word,
          _flex: true,
          _budgetStime: old.stime,
          _budgetEtime: old.etime,
        }
      }
      // Unknown (or duplicate) wid → recover timing by matching text within the
      // same old turn (only from a timed word). Preserves legacy timestamps.
      const q = oldTimedByText.get(nw.word)
      if (q) {
        for (const idx of q) {
          if (textConsumed.has(idx)) continue
          textConsumed.add(idx)
          return { ...oldWords[idx], wid: nw.wid, word: nw.word }
        }
      }
      // Truly new word → interpolate from neighbours.
      return { wid: nw.wid, word: nw.word, _flex: true }
    })

    interpolateWordTimes(words, oldTurn, syllabic)

    // Reference-stability: reuse the old words array when nothing changed so
    // turnPersistDiffers (a reference compare on words) reports no change.
    let finalWords = words
    let wordsChanged = true
    if (oldTurn && sameWords(oldTurn.words, words)) {
      finalWords = oldTurn.words
      wordsChanged = false
    }

    const finalTurn = {
      ...(oldTurn || {}),
      turn_id: nt.turn_id,
      speaker_id: nt.speaker_id ?? null,
      language: nt.language || "",
      segment: nt.segment,
      raw_segment: nt.segment,
      words: finalWords,
    }
    // Turn-level times: prefer the first/last DEFINED word time; else fall back
    // to the doc's turn attrs (nt), else keep the old turn's (already spread).
    // Never overwrite with undefined — some ASR output has no per-word timing,
    // only turn-level times, and a flush must not destroy them.
    const wStime = firstStime(finalWords)
    const wEtime = lastEtime(finalWords)
    const stime = wStime ?? nt.stime ?? (oldTurn && oldTurn.stime)
    const etime = wEtime ?? nt.etime ?? (oldTurn && oldTurn.etime)
    if (stime != null) finalTurn.stime = stime
    if (etime != null) finalTurn.etime = etime

    if (wordsChanged) {
      changedTurns.push({ turn_id: finalTurn.turn_id, words: finalWords })
    }
    if (!oldTurn || wordsChanged || turnMetaChanged(oldTurn, nt)) {
      dirty = true
    }
    return finalTurn
  })

  // Structural change (add / remove / reorder / merge / split) → dirty.
  if (!dirty) {
    if (oldTurns.length !== finalTurns.length) {
      dirty = true
    } else {
      for (let i = 0; i < finalTurns.length; i++) {
        if (oldTurns[i].turn_id !== finalTurns[i].turn_id) {
          dirty = true
          break
        }
      }
    }
  }

  debug(
    "enrichDiff: %d old -> %d new turns, dirty=%s, changed=%d",
    oldTurns.length,
    newTurns.length,
    dirty,
    changedTurns.length,
  )

  return { finalTurns, changedTurns, hasChanges: dirty }
}

// Word lists equal when same length and every wid/word/stime/etime matches.
// Old turns may still carry empty (silence) placeholder words from before the
// migration; those make the length differ and force one clean rewrite.
function sameWords(a, b) {
  if (!Array.isArray(a) || a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (
      a[i].wid !== b[i].wid ||
      a[i].word !== b[i].word ||
      a[i].stime !== b[i].stime ||
      a[i].etime !== b[i].etime
    ) {
      return false
    }
  }
  return true
}

// First/last DEFINED word time — robust to words with no timestamp (sparse or
// fully absent when the ASR computed no per-word timing).
function firstStime(words) {
  for (const w of words) if (w.stime != null) return w.stime
  return undefined
}
function lastEtime(words) {
  for (let i = words.length - 1; i >= 0; i--) {
    if (words[i].etime != null) return words[i].etime
  }
  return undefined
}

function turnMetaChanged(oldTurn, newTurn) {
  return (
    (oldTurn.speaker_id ?? null) !== (newTurn.speaker_id ?? null) ||
    (oldTurn.language || "") !== (newTurn.language || "") ||
    (oldTurn.segment ?? "") !== (newTurn.segment ?? "")
  )
}

module.exports = { enrichDiff }
