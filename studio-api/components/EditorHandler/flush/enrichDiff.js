const { getSyllabic } = require("../words/syllabic")
const { recomputeWords } = require("../words/recomputeWords")
const { divideTurn } = require("../words/divideTurn")
const { mergeTurn } = require("../words/mergeTurn")

/**
 * Build the full new turns[] (ordered as in the Y.Doc, words+timestamps
 * preserved/recomputed) by classifying each new turn against the last-flushed
 * Mongo state.
 *
 * Cases handled per new turn:
 *  - id matches old, segment unchanged → keep old words, copy meta.
 *  - id matches old, segment changed → recomputeWords (syllabic heuristic).
 *  - id matches old, segment shrunk and one or more brand-new ids follow whose
 *    concat matches the original segment → split (1→N), divideTurn cascade.
 *  - id matches old, segment is concat of old[i..i+k] segments → merge (N→1).
 *  - new id with no split signal → fresh turn with empty words.
 *
 * Old turns absent from the new list (and not consumed by a merge) are dropped.
 *
 * @returns {{
 *   finalTurns: Array,           // ordered, ready to $set Mongo
 *   changedTurns: Array<{ turn_id: string, words: Array }>,  // for stateless broadcast
 *   hasChanges: boolean,
 * }}
 */
function enrichDiff(oldTurns, newTurns) {
  const oldById = new Map(oldTurns.map((t) => [t.turn_id, t]))
  const oldByIndex = oldTurns
  const oldIndexById = new Map(oldTurns.map((t, idx) => [t.turn_id, idx]))
  const newIds = new Set(newTurns.map((t) => t.turn_id))

  // Stores Pass 1/2 output keyed by new-turn index, so Pass 3 can reinsert
  // them at their position in Y.Doc order.
  const produced = new Map()
  const consumedOldIds = new Set()
  const changedTurns = []
  let dirty = false

  // ── Pass 1: detect splits (1 old → N new, N >= 2) ───────────────────────
  for (let i = 0; i < newTurns.length; i++) {
    if (produced.has(i)) continue
    const cur = newTurns[i]
    const oldCur = oldById.get(cur.turn_id)
    if (!oldCur) continue
    if (segmentEqual(cur.segment, oldCur.segment)) continue

    const splitMatch = matchSplit(newTurns, i, oldById, oldCur)
    if (!splitMatch) continue

    const candidates = splitMatch.indices.map((idx) => newTurns[idx])
    const syllabic = getSyllabic(oldCur.language || cur.language)
    const parts = cascadeDivide(oldCur, candidates, syllabic)

    parts.forEach((part, k) => {
      const finalTurn = combine(candidates[k], part)
      produced.set(splitMatch.indices[k], finalTurn)
      changedTurns.push({ turn_id: finalTurn.turn_id, words: finalTurn.words })
    })
    consumedOldIds.add(oldCur.turn_id)
    dirty = true
  }

  // ── Pass 2: detect merges (N old → 1 new, N >= 2) ───────────────────────
  for (let i = 0; i < newTurns.length; i++) {
    if (produced.has(i)) continue
    const cur = newTurns[i]
    const oldCur = oldById.get(cur.turn_id)
    if (!oldCur) continue
    if (segmentEqual(cur.segment, oldCur.segment)) continue

    const oldCurIdx = oldIndexById.get(oldCur.turn_id)
    if (oldCurIdx === undefined) continue

    const mergeMatch = matchMerge(cur.segment, oldByIndex, oldCurIdx, newIds)
    if (!mergeMatch) continue

    let merged = oldCur
    for (let k = oldCurIdx + 1; k <= oldCurIdx + mergeMatch.count; k++) {
      merged = mergeTurn(merged, oldByIndex[k], cur.turn_id)
      consumedOldIds.add(oldByIndex[k].turn_id)
    }
    consumedOldIds.add(oldCur.turn_id)

    const finalTurn = combine(cur, merged)
    finalTurn.segment = cur.segment
    finalTurn.raw_segment = cur.segment

    produced.set(i, finalTurn)
    changedTurns.push({ turn_id: finalTurn.turn_id, words: finalTurn.words })
    dirty = true
  }

  // ── Pass 3: classic per-turn classification, walking in Y.Doc order ─────
  const finalTurns = []
  for (let i = 0; i < newTurns.length; i++) {
    const fromPass12 = produced.get(i)
    if (fromPass12) {
      finalTurns.push(fromPass12)
      continue
    }

    const cur = newTurns[i]
    const oldTurn = oldById.get(cur.turn_id)

    if (!oldTurn) {
      // Fresh turn with no split signal: empty words.
      const t = { ...cur, words: [], raw_segment: cur.segment }
      finalTurns.push(t)
      changedTurns.push({ turn_id: t.turn_id, words: [] })
      dirty = true
      continue
    }

    if (segmentEqual(oldTurn.segment, cur.segment)) {
      // Old turn first: Mongo may carry fields the Y.Doc doesn't know
      // (stime/etime from live sessions, ...) — editor-owned fields override.
      const t = {
        ...oldTurn,
        ...cur,
        words: oldTurn.words || [],
        raw_segment: oldTurn.raw_segment || oldTurn.segment,
      }
      finalTurns.push(t)
      if (turnMetaChanged(oldTurn, cur)) dirty = true
      continue
    }

    const syllabic = getSyllabic(cur.language || oldTurn.language)
    let newWords
    try {
      newWords = recomputeWords(oldTurn.words || [], cur.segment, syllabic)
    } catch (err) {
      console.error(`recomputeWords failed for turn ${cur.turn_id}:`, err)
      newWords = null
    }
    if (newWords == null) {
      // Split on whitespace runs: never fabricate empty words from
      // consecutive spaces in the segment.
      newWords = cur.segment
        ? cur.segment
            .split(/\s+/)
            .filter(Boolean)
            .map((w) => ({ word: w }))
        : []
    }

    const t = { ...oldTurn, ...cur, words: newWords, raw_segment: cur.segment }
    finalTurns.push(t)
    changedTurns.push({ turn_id: t.turn_id, words: newWords })
    dirty = true
  }

  // Detect pure deletions (old turns absent, not consumed by merge).
  if (!dirty) {
    for (const oldTurn of oldByIndex) {
      if (consumedOldIds.has(oldTurn.turn_id)) continue
      if (!newIds.has(oldTurn.turn_id)) {
        dirty = true
        break
      }
    }
  }

  return { finalTurns, changedTurns, hasChanges: dirty }
}

// ── Helpers ────────────────────────────────────────────────────────────────

// Whitespace runs collapse before comparison: legacy seeds built from words
// arrays containing empty placeholder words carry double spaces, and a user
// can type consecutive spaces — neither is a content change.
function normalizeSegment(s) {
  return (s || "").replace(/\s+/g, " ").trim()
}

function segmentEqual(a, b) {
  return normalizeSegment(a) === normalizeSegment(b)
}

function turnMetaChanged(oldTurn, newTurn) {
  return (
    oldTurn.speaker_id !== newTurn.speaker_id ||
    (oldTurn.language || "") !== (newTurn.language || "")
  )
}

/**
 * Walk forward from index i in newTurns absorbing fresh ids until the
 * concatenated segments equal oldCur.segment. Returns null if no match.
 */
function matchSplit(newTurns, i, oldById, oldCur) {
  const original = normalizeSegment(oldCur.segment)
  if (!original) return null

  let combined = normalizeSegment(newTurns[i].segment)
  if (!combined) return null
  if (combined === original) return null // not a split, just unchanged
  if (!startsWithWord(original, combined)) return null

  const indices = [i]
  let j = i + 1
  while (j < newTurns.length) {
    const nxt = newTurns[j]
    if (oldById.has(nxt.turn_id)) break // would-be split fragment must be fresh
    const nxtSeg = normalizeSegment(nxt.segment)
    if (nxtSeg) {
      const tentative = (combined + " " + nxtSeg).trim()
      if (!startsWithWord(original, tentative) && tentative !== original) break
      combined = tentative
    }
    indices.push(j)
    if (combined === original) {
      return indices.length >= 2 ? { indices } : null
    }
    j++
  }
  return null
}

/**
 * Walk forward from oldByIndex[start+1] absorbing disappeared ids until the
 * concatenated segments equal cur.segment. Returns null if no match.
 */
function matchMerge(curSegment, oldByIndex, start, newIds) {
  const target = normalizeSegment(curSegment)
  if (!target) return null

  let combined = normalizeSegment(oldByIndex[start].segment)
  if (!combined) return null
  if (combined === target) return null
  if (!startsWithWord(target, combined)) return null

  for (let k = 1; start + k < oldByIndex.length; k++) {
    const next = oldByIndex[start + k]
    if (newIds.has(next.turn_id)) break // not gone
    const nextSeg = normalizeSegment(next.segment)
    if (nextSeg) {
      const tentative = (combined + " " + nextSeg).trim()
      if (!startsWithWord(target, tentative) && tentative !== target) break
      combined = tentative
    }
    if (combined === target) return { count: k }
  }
  return null
}

// Whitespace-tolerant prefix check on word boundaries.
function startsWithWord(haystack, needle) {
  if (haystack === needle) return true
  return haystack.startsWith(needle + " ")
}

/**
 * Apply divideTurn iteratively to split oldTurn into N parts following the
 * candidate segments. Each cut redistributes timestamps via the syllabic
 * heuristic; the last part receives whatever words remain.
 */
function cascadeDivide(oldTurn, candidates, syllabic) {
  const parts = []
  let remaining = oldTurn

  for (let k = 0; k < candidates.length - 1; k++) {
    const cur = candidates[k]
    const nextSegment = candidates
      .slice(k + 1)
      .map((c) => (c.segment || "").trim())
      .filter(Boolean)
      .join(" ")

    const [first, second] = divideTurn(
      remaining,
      cur.segment || "",
      nextSegment,
      syllabic,
      cur.turn_id,
      candidates[k + 1].turn_id,
    )
    parts.push(first)
    remaining = second
  }
  const last = candidates[candidates.length - 1]
  parts.push({
    ...remaining,
    segment: last.segment || "",
    turn_id: last.turn_id,
  })
  return parts
}

/**
 * `computed` derives from the old Mongo turn (divideTurn/mergeTurn spread it),
 * so it carries fields the Y.Doc doesn't know (stime/etime, ...). Editor-owned
 * fields from the doc (`newTurn`: speaker_id, language) must override them —
 * e.g. a speaker change on a freshly split half — while the recomputed
 * words/segment are reasserted last.
 */
function combine(newTurn, computed) {
  return {
    ...computed,
    ...newTurn,
    words: computed.words,
    segment: computed.segment,
    raw_segment: computed.segment,
  }
}

module.exports = { enrichDiff }
