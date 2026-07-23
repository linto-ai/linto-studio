const Y = require("yjs")
const { randomUUID } = require("crypto")
const { tokenize } = require("../../EditorHandler2/utils/tokenize")
const { retimeTurn } = require("../../EditorHandler2/utils/retimeTurn")
const { alignWords } = require("../../EditorHandler2/utils/align")

function round2(n) {
  return parseFloat(n.toFixed(2))
}

/**
 * Per-document companion state: the words+timestamps mirror of a plain-text
 * editor Y.Doc, derived from Yjs deltas (delta-first design).
 *
 * Two paths:
 *  - HOT (applyEvents, on every transaction): pure bookkeeping — shift the
 *    touched turn's word offsets, maintain a text mirror, flag dirty turns,
 *    capture deleted text (Yjs deltas don't carry deleted content) and
 *    correlate it with same-batch insertions to survive turn split/merge.
 *  - DEBOUNCED (retimeDirty): re-tokenize dirty turns and run retimeTurn to
 *    produce the new word timings for broadcast + Mongo flush.
 *
 * The caller owns the observer lifecycle: attach
 * `turnsFragment.observeDeep((events) => state.applyEvents(events))` itself.
 *
 * Mirrors are keyed by the turn Y.XmlElement INSTANCE (stable within a doc);
 * order always comes from the turnsFragment. The `id` attribute is only read
 * lazily at retime/serialize time (it may transiently be null until the
 * server assigns one).
 *
 * Word entry shape (offsets in UTF-16 code units, relative to the turn text):
 *   { text, charStart, charEnd, stime, etime, wid, confidence }
 */
class WordsState {
  /** @param {import("yjs").XmlFragment} turnsFragment */
  constructor(turnsFragment) {
    this.turnsFragment = turnsFragment
    /** @type {Map<import("yjs").XmlElement, object>} */
    this.turnMirrors = new Map()
  }

  /**
   * Initial alignment against Mongo. The persisted Yjs state may be AHEAD of
   * Mongo (invariant: state >= text), so the doc text is the reference and
   * the Mongo words are aligned onto it. Turns left partially unmatched stay
   * dirty: the first retimeDirty completes their timing.
   *
   * @param {Array<{turn_id, speaker_id, segment, language, stime, etime, words}>} mongoTurns
   */
  hydrate(mongoTurns) {
    this.turnMirrors = new Map()
    const mongoTurnsById = new Map()
    for (const t of mongoTurns || []) mongoTurnsById.set(t.turn_id, t)

    // A Mongo turn feeds at most ONE element: without this, the positional
    // fallback could hand a turn already consumed by its id-match to a second
    // element, duplicating wids/timings.
    const consumedTurns = new Set()

    const yjsTurnElements = extractTurnElements(this.turnsFragment)
    for (let i = 0; i < yjsTurnElements.length; i++) {
      const yjsTurn = yjsTurnElements[i]
      const id = yjsTurn.getAttribute("id")
      const positional = (mongoTurns || [])[i]
      const candidate =
        (id != null ? mongoTurnsById.get(id) : undefined) ??
        (positional && !consumedTurns.has(positional) ? positional : undefined)
      const mongoTurn =
        candidate && !consumedTurns.has(candidate) ? candidate : undefined

      const text = getElementText(yjsTurn)
      if (!mongoTurn) {
        this.turnMirrors.set(yjsTurn, makeTurnMirror(text))
        continue
      }
      consumedTurns.add(mongoTurn)

      const tokens = tokenize(text)
      const oldWords = mongoTurn.words || []
      const carried = alignWords(tokens, oldWords)
      this.turnMirrors.set(yjsTurn, {
        text,
        words: carried,
        language: mongoTurn.language || null,
        stime: mongoTurn.stime,
        etime: mongoTurn.etime,
        // The original Mongo turn: fields this module doesn't own
        // (raw_segment before edit, lang, future additions) must survive the
        // round-trip — serialize() spreads it under its own fields.
        mongo: mongoTurn,
        // Fully matched both ways -> timings are already complete.
        dirty:
          carried.length !== tokens.length ||
          carried.length !== oldWords.length,
      })
    }
  }

  /**
   * HOT PATH — bookkeeping for one observeDeep batch. The batch scratch
   * (removed/inserted texts) lives and dies within this call.
   *
   * @param {Array<import("yjs").YEvent>} events
   */
  applyEvents(events) {
    const removedTexts = [] // [{ text, words }] — words offsets relative to text
    const insertedTexts = [] // [{ turn, mirror, text, at }]
    const touched = new Set() // turn elements to self-check
    let childrenChanged = false

    for (const event of events) {
      const target = event.target

      if (target === this.turnsFragment) {
        childrenChanged = true
        continue
      }

      if (target instanceof Y.XmlText) {
        const turn = this._owningTurn(target)
        const mirror = turn ? this.turnMirrors.get(turn) : undefined
        // Unknown turn: added in this batch, handled structurally below.
        if (!mirror) continue
        this._applyTextDelta(
          turn,
          mirror,
          target,
          event.delta,
          removedTexts,
          insertedTexts,
        )
        mirror.dirty = true
        touched.add(turn)
        continue
      }

      // Turn element event: attribute changes need nothing (id/speakerId are
      // read lazily); a change to the element's own CHILD list (anomalous
      // shape) invalidates the mirror — the self-check below realigns it.
      if (event.childListChanged && this.turnMirrors.has(target)) {
        this.turnMirrors.get(target).dirty = true
        touched.add(target)
      }
    }

    if (childrenChanged) this._reconcileChildren(removedTexts, touched)

    this._graftInsertedTexts(insertedTexts, removedTexts)

    this._selfCheck(touched)
  }

  /** @returns {boolean} any turn pending retime? */
  hasDirty() {
    for (const mirror of this.turnMirrors.values()) {
      if (mirror.dirty) return true
    }
    return false
  }

  /**
   * DEBOUNCED PATH — re-tokenize and retime every dirty turn.
   *
   * wid preservation mirrors retimeTurn's overlap semantics: a token in a
   * one-to-one overlap with a carried entry keeps that entry's wid (and
   * confidence); any other shape (typed, merged, split) gets a fresh wid.
   *
   * @param {(language: string) => object} getSyllabic
   * @returns {Array<{turn_id: string|null, words: Array}>} changed turns —
   *   turns still waiting for a server-assigned id come back with turn_id null
   */
  retimeDirty(getSyllabic) {
    const changed = []
    for (const element of extractTurnElements(this.turnsFragment)) {
      const mirror = this.turnMirrors.get(element)
      if (!mirror || !mirror.dirty) continue

      const tokens = tokenize(mirror.text)
      const identities = tokenIdentities(tokens, mirror.words)
      const retimed = retimeTurn(
        tokens,
        mirror.words,
        { stime: mirror.stime, etime: mirror.etime },
        getSyllabic(turnLanguage(element, mirror)),
      )

      mirror.words = retimed.map((w, i) => {
        const kept = identities[i]
        return {
          text: w.word,
          charStart: tokens[i].charStart,
          charEnd: tokens[i].charEnd,
          stime: w.stime != null ? round2(w.stime) : undefined,
          etime: w.etime != null ? round2(w.etime) : undefined,
          wid: kept && kept.wid != null ? kept.wid : randomUUID(),
          confidence: kept ? kept.confidence : undefined,
        }
      })

      const first = mirror.words.find((w) => w.stime != null)
      if (first) mirror.stime = first.stime
      for (let i = mirror.words.length - 1; i >= 0; i--) {
        if (mirror.words[i].etime != null) {
          mirror.etime = mirror.words[i].etime
          break
        }
      }
      mirror.dirty = false

      changed.push({
        turn_id: element.getAttribute("id") ?? null,
        words: mirror.words.map(wireWord),
      })
    }
    return changed
  }

  /**
   * Full ordered turns[] for a Mongo $set. Fields this module doesn't own
   * (anything present on the hydrated Mongo turn: lang, confidence, future
   * additions) are preserved by spreading the original turn UNDER the owned
   * fields — the flush replaces whole turn documents, so dropping them here
   * would delete them from Mongo permanently.
   * @returns {Array<{turn_id, speaker_id, segment, raw_segment, language, stime, etime, words}>}
   */
  serialize() {
    return extractTurnElements(this.turnsFragment).map((element) => {
      let mirror = this.turnMirrors.get(element)
      if (!mirror) {
        // Defensive: an element never seen (observer not yet attached).
        mirror = makeTurnMirror(getElementText(element))
        this.turnMirrors.set(element, mirror)
      }
      return {
        ...(mirror.mongo || {}),
        turn_id: element.getAttribute("id") ?? null,
        speaker_id: element.getAttribute("speakerId") ?? null,
        segment: mirror.text,
        // Same rule as the previous flush (enrichDiff): raw_segment follows
        // the edited text — consumers (search, REST merge) regex/concat it.
        raw_segment: mirror.text,
        language: turnLanguage(element, mirror),
        stime: mirror.stime,
        etime: mirror.etime,
        words: mirror.words.map(wireWord),
      }
    })
  }

  /**
   * Recovery: realign every mirror whose mirror diverged from the doc (used
   * after an applyEvents exception — a half-applied batch may leave one turn's
   * mirror corrupt, and later batches only self-check the turns THEY touch).
   */
  realignAll() {
    this._selfCheck(new Set(extractTurnElements(this.turnsFragment)))
  }

  // --- Hot-path internals ---

  /**
   * Apply one Y.Text delta to a turn mirror: splice the mirror, shift/extend/
   * shrink word offsets, capture removed text+words and inserted text for the
   * batch's split/merge correlation.
   */
  _applyTextDelta(turn, mirror, target, delta, removedTexts, insertedTexts) {
    // Offset of this text node within the whole turn text (0 in the normal
    // single-XmlText shape). Uses current sibling lengths: if a sibling also
    // changed in this batch the mirror may drift — the self-check heals it.
    let cursor = precedingTextLength(turn, target)

    for (const op of delta) {
      if (op.retain != null) {
        cursor += op.retain
        continue
      }

      if (op.insert != null) {
        // Non-string inserts (embeds) are not expected in turn text; skipping
        // them desyncs the mirror on purpose so the self-check realigns.
        const str = typeof op.insert === "string" ? op.insert : ""
        if (!str) continue
        const len = str.length
        for (const entry of mirror.words) {
          if (entry.charStart >= cursor) {
            // At an entry boundary the insertion belongs to no entry (gap).
            entry.charStart += len
            entry.charEnd += len
          } else if (entry.charEnd > cursor) {
            // Strictly inside: the entry stretches around the insertion.
            entry.charEnd += len
          }
        }
        mirror.text =
          mirror.text.slice(0, cursor) + str + mirror.text.slice(cursor)
        if (str.trim() !== "") {
          insertedTexts.push({ turn, mirror, text: str, at: cursor })
        }
        cursor += len
        continue
      }

      if (op.delete != null) {
        const n = op.delete
        const delEnd = cursor + n
        // Yjs deltas don't carry deleted content: capture it from the mirror.
        const removedStr = mirror.text.slice(cursor, delEnd)
        const removedWords = []
        const kept = []
        for (const entry of mirror.words) {
          if (entry.charEnd <= cursor) {
            kept.push(entry)
          } else if (entry.charStart >= delEnd) {
            entry.charStart -= n
            entry.charEnd -= n
            kept.push(entry)
          } else if (entry.charStart >= cursor && entry.charEnd <= delEnd) {
            // Fully inside: gone from this turn, offsets rebased to the chunk
            // so a same-batch re-insertion can adopt it (turn split/move).
            removedWords.push({
              ...entry,
              charStart: entry.charStart - cursor,
              charEnd: entry.charEnd - cursor,
            })
          } else {
            // Straddling: shrink to what survives.
            entry.charStart = Math.min(entry.charStart, cursor)
            entry.charEnd = entry.charEnd > delEnd ? entry.charEnd - n : cursor
            kept.push(entry)
          }
        }
        mirror.words = kept
        if (removedStr.trim() !== "") {
          removedTexts.push({ text: removedStr, words: removedWords })
        }
        mirror.text = mirror.text.slice(0, cursor) + mirror.text.slice(delEnd)
      }
    }
  }

  /**
   * Diff the turnsFragment children against known turnMirrors: capture removed turns
   * into removedTexts, create turnMirrors for added turns and try to adopt a
   * same-batch removed chunk (turn split / re-creation move-matching).
   */
  _reconcileChildren(removedTexts, touched) {
    const current = new Set(extractTurnElements(this.turnsFragment))

    for (const [element, mirror] of [...this.turnMirrors]) {
      if (current.has(element)) continue
      if (mirror.text.trim() !== "") {
        removedTexts.push({ text: mirror.text, words: mirror.words })
      }
      this.turnMirrors.delete(element)
    }

    for (const element of current) {
      if (this.turnMirrors.has(element)) continue
      const mirror = makeTurnMirror(getElementText(element))
      this.turnMirrors.set(element, mirror)
      touched.add(element)

      const tokens = tokenize(mirror.text)
      if (tokens.length === 0) continue
      for (let i = 0; i < removedTexts.length; i++) {
        const removed = removedTexts[i]
        const removedTokens = tokenize(removed.text)
        if (!sameTokenTexts(tokens, removedTokens)) continue
        // Same words, new home: adopt timings, offsets from the new tokens.
        mirror.words = transferWords(removed.words, removedTokens, tokens, 0)
        removedTexts.splice(i, 1)
        break
      }
    }
  }

  /**
   * Turn MERGE correlation: an inserted chunk whose tokenization equals a
   * same-batch removed chunk gets the removed words grafted at its position.
   * Only whole-chunk exact token matches; anything fancier falls through (the
   * turn is dirty anyway — retime will interpolate).
   */
  _graftInsertedTexts(insertedTexts, removedTexts) {
    for (const ins of insertedTexts) {
      if (removedTexts.length === 0) return
      // The turn may have been removed later in the same batch.
      if (this.turnMirrors.get(ins.turn) !== ins.mirror) continue

      const insTokens = tokenize(ins.text)
      if (insTokens.length === 0) continue

      for (let i = 0; i < removedTexts.length; i++) {
        const removed = removedTexts[i]
        const removedTokens = tokenize(removed.text)
        if (!sameTokenTexts(insTokens, removedTokens)) continue
        const grafted = transferWords(
          removed.words,
          removedTokens,
          insTokens,
          ins.at,
        )
        ins.mirror.words = ins.mirror.words
          .concat(grafted)
          .sort((a, b) => a.charStart - b.charStart)
        removedTexts.splice(i, 1)
        break
      }
    }
  }

  /**
   * Cheap per-batch invariant: the mirror must equal the element's actual
   * text. On mismatch, warn and REALIGN from the current words — the state is
   * self-healing, a drift costs one alignment, never a corruption.
   */
  _selfCheck(touched) {
    for (const turn of touched) {
      const mirror = this.turnMirrors.get(turn)
      if (!mirror) continue // removed in the same batch
      const actual = getElementText(turn)
      if (mirror.text === actual) continue

      console.warn(
        `WordsState: mirror out of sync with doc text (mirror=${mirror.text.length} chars, doc=${actual.length} chars), realigning turn`,
      )
      const oldWords = mirror.words.map((e) => ({
        word: e.text,
        stime: e.stime,
        etime: e.etime,
        wid: e.wid,
        confidence: e.confidence,
      }))
      mirror.words = alignWords(tokenize(actual), oldWords)
      mirror.text = actual
      mirror.dirty = true
    }
  }

  // --- Helpers ---

  /** Climb from an event target to the turnsFragment child that contains it. */
  _owningTurn(target) {
    let node = target
    while (node && node.parent && node.parent !== this.turnsFragment) {
      node = node.parent
    }
    return node && node.parent === this.turnsFragment ? node : null
  }
}

/** Extract the turns from the fragment, in document order. By schema every
 *  element child of the fragment IS a turn (doc = turn+); the filter only
 *  discards bare text nodes at root level, which Yjs (schema-less) doesn't
 *  prevent. Computes a fresh array on every call. */
function extractTurnElements(turnsFragment) {
  return turnsFragment.toArray().filter((c) => c instanceof Y.XmlElement)
}

function makeTurnMirror(text) {
  return {
    text,
    words: [],
    language: null,
    stime: undefined,
    etime: undefined,
    mongo: null,
    dirty: true,
  }
}

/** A turn's language: the live doc attribute wins (a ProseMirror split copies
 *  node attrs onto the new turn), then the hydrated Mongo value, then French
 *  (the syllabic default). */
function turnLanguage(element, mirror) {
  return element.getAttribute("language") || mirror.language || "fr"
}

/** A turn's plain text: all its XmlText children concatenated in order,
 *  formatting attributes ignored (XmlText.toString would serialize them). */
function getElementText(element) {
  let text = ""
  for (let i = 0; i < element.length; i++) {
    const child = element.get(i)
    if (child instanceof Y.XmlText) text += plainText(child)
  }
  return text
}

function plainText(xmlText) {
  let text = ""
  for (const op of xmlText.toDelta()) {
    if (typeof op.insert === "string") text += op.insert
  }
  return text
}

/** Offset of a text node inside its turn (sum of preceding text lengths). */
function precedingTextLength(turn, target) {
  let base = 0
  for (let i = 0; i < turn.length; i++) {
    const child = turn.get(i)
    if (child === target) return base
    if (child instanceof Y.XmlText) base += plainText(child).length
  }
  return base
}

/** Token-sequence equality by TEXT — whitespace layout differences are fine. */
function sameTokenTexts(a, b) {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i].text !== b[i].text) return false
  }
  return true
}

/**
 * Re-home word entries by token index: each entry maps to the fromToken
 * containing its charStart, and receives the same-index toToken's offsets
 * (shifted by `offset`). Both token lists carry the same texts. Entries that
 * fall between tokens (corrupt offsets) are dropped — retime interpolates.
 */
function transferWords(entries, fromTokens, toTokens, offset) {
  const out = []
  for (const entry of entries) {
    const idx = tokenIndexAt(fromTokens, entry.charStart)
    if (idx === -1) continue
    out.push({
      text: entry.text,
      charStart: toTokens[idx].charStart + offset,
      charEnd: toTokens[idx].charEnd + offset,
      stime: entry.stime,
      etime: entry.etime,
      wid: entry.wid,
      confidence: entry.confidence,
    })
  }
  return out
}

function tokenIndexAt(tokens, pos) {
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].charStart <= pos && pos < tokens[i].charEnd) return i
  }
  return -1
}

/**
 * Which carried entry each token may inherit its identity from — mirrors
 * retimeTurn's collectOverlaps/countClaims semantics (half-open ranges,
 * touching is not overlapping). Only a one-to-one token<->entry overlap
 * carries identity: a shared entry (split word) or a multi-entry token
 * (merged words) would duplicate or misattribute wids.
 */
function tokenIdentities(tokens, entries) {
  const overlaps = tokens.map(() => [])
  let c = 0
  for (let t = 0; t < tokens.length; t++) {
    const token = tokens[t]
    while (c < entries.length && entries[c].charEnd <= token.charStart) c++
    for (
      let k = c;
      k < entries.length && entries[k].charStart < token.charEnd;
      k++
    ) {
      overlaps[t].push(entries[k])
    }
  }
  const claims = new Map()
  for (const list of overlaps) {
    for (const e of list) claims.set(e, (claims.get(e) || 0) + 1)
  }
  return overlaps.map((list) =>
    list.length === 1 && claims.get(list[0]) === 1 ? list[0] : null,
  )
}

/** Wire/Mongo word shape. Undefined fields are OMITTED, not emitted: the
 *  Mongo driver persists undefined as BSON null (ignoreUndefined is off),
 *  which would change `"stime" in word`-style checks downstream. */
function wireWord(entry) {
  const word = { wid: entry.wid, word: entry.text }
  if (entry.stime != null) word.stime = entry.stime
  if (entry.etime != null) word.etime = entry.etime
  if (entry.confidence != null) word.confidence = entry.confidence
  return word
}

module.exports = { WordsState }
