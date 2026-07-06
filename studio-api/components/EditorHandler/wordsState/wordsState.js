const Y = require("yjs")
const { randomUUID } = require("crypto")
const { tokenize } = require("../words/tokenize")
const { retimeTurn } = require("../words/retimeTurn")
const { alignWords } = require("./align")

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
 * `fragment.observeDeep((events) => state.applyEvents(events))` itself.
 *
 * Records are keyed by the turn Y.XmlElement INSTANCE (stable within a doc);
 * order always comes from the fragment. The `id` attribute is only read
 * lazily at retime/serialize time (it may transiently be null until the
 * server mints one).
 *
 * Word entry shape (offsets in UTF-16 code units, relative to the turn text):
 *   { text, charStart, charEnd, stime, etime, wid, confidence }
 */
class WordsState {
  /** @param {import("yjs").XmlFragment} fragment */
  constructor(fragment) {
    this.fragment = fragment
    /** @type {Map<import("yjs").XmlElement, object>} */
    this.records = new Map()
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
    this.records = new Map()
    const byId = new Map()
    for (const t of mongoTurns || []) byId.set(t.turn_id, t)

    // A Mongo turn feeds at most ONE element: without this, the positional
    // fallback could hand a turn already claimed by its id-match to a second
    // element, duplicating wids/timings.
    const claimed = new Set()

    const elements = this._turnElements()
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i]
      const id = element.getAttribute("id")
      const positional = (mongoTurns || [])[i]
      const candidate =
        (id != null ? byId.get(id) : undefined) ??
        (positional && !claimed.has(positional) ? positional : undefined)
      const mongoTurn =
        candidate && !claimed.has(candidate) ? candidate : undefined

      const text = getElementText(element)
      if (!mongoTurn) {
        this.records.set(element, makeRecord(text))
        continue
      }
      claimed.add(mongoTurn)

      const tokens = tokenize(text)
      const oldWords = mongoTurn.words || []
      const carried = alignWords(tokens, oldWords)
      this.records.set(element, {
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
    const insertedTexts = [] // [{ turn, record, text, at }]
    const touched = new Set() // turn elements to self-check
    let childrenChanged = false

    for (const event of events) {
      const target = event.target

      if (target === this.fragment) {
        childrenChanged = true
        continue
      }

      if (target instanceof Y.XmlText) {
        const turn = this._owningTurn(target)
        const record = turn ? this.records.get(turn) : undefined
        // Unknown turn: added in this batch, handled structurally below.
        if (!record) continue
        this._applyTextDelta(
          turn,
          record,
          target,
          event.delta,
          removedTexts,
          insertedTexts,
        )
        record.dirty = true
        touched.add(turn)
        continue
      }

      // Turn element event: attribute changes need nothing (id/speakerId are
      // read lazily); a change to the element's own CHILD list (anomalous
      // shape) invalidates the mirror — the self-check below realigns it.
      if (event.childListChanged && this.records.has(target)) {
        this.records.get(target).dirty = true
        touched.add(target)
      }
    }

    if (childrenChanged) this._reconcileChildren(removedTexts, touched)

    this._graftInsertedTexts(insertedTexts, removedTexts)

    this._selfCheck(touched)
  }

  /** @returns {boolean} any turn pending retime? */
  hasDirty() {
    for (const record of this.records.values()) {
      if (record.dirty) return true
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
   *   turns still waiting for a server-minted id come back with turn_id null
   */
  retimeDirty(getSyllabic) {
    const changed = []
    for (const element of this._turnElements()) {
      const record = this.records.get(element)
      if (!record || !record.dirty) continue

      const tokens = tokenize(record.text)
      const identities = tokenIdentities(tokens, record.words)
      const retimed = retimeTurn(
        tokens,
        record.words,
        { stime: record.stime, etime: record.etime },
        getSyllabic(turnLanguage(element, record)),
      )

      record.words = retimed.map((w, i) => {
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

      const first = record.words.find((w) => w.stime != null)
      if (first) record.stime = first.stime
      for (let i = record.words.length - 1; i >= 0; i--) {
        if (record.words[i].etime != null) {
          record.etime = record.words[i].etime
          break
        }
      }
      record.dirty = false

      changed.push({
        turn_id: element.getAttribute("id") ?? null,
        words: record.words.map(wireWord),
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
    return this._turnElements().map((element) => {
      let record = this.records.get(element)
      if (!record) {
        // Defensive: an element never seen (observer not yet attached).
        record = makeRecord(getElementText(element))
        this.records.set(element, record)
      }
      return {
        ...(record.mongo || {}),
        turn_id: element.getAttribute("id") ?? null,
        speaker_id: element.getAttribute("speakerId") ?? null,
        segment: record.text,
        // Same rule as the previous flush (enrichDiff): raw_segment follows
        // the edited text — consumers (search, REST merge) regex/concat it.
        raw_segment: record.text,
        language: turnLanguage(element, record),
        stime: record.stime,
        etime: record.etime,
        words: record.words.map(wireWord),
      }
    })
  }

  /**
   * Recovery: realign every record whose mirror diverged from the doc (used
   * after an applyEvents exception — a half-applied batch may leave one turn's
   * mirror corrupt, and later batches only self-check the turns THEY touch).
   */
  realignAll() {
    this._selfCheck(new Set(this._turnElements()))
  }

  // --- Hot-path internals ---

  /**
   * Apply one Y.Text delta to a turn record: splice the mirror, shift/extend/
   * shrink word offsets, capture removed text+words and inserted text for the
   * batch's split/merge correlation.
   */
  _applyTextDelta(turn, record, target, delta, removedTexts, insertedTexts) {
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
        for (const entry of record.words) {
          if (entry.charStart >= cursor) {
            // At an entry boundary the insertion belongs to no entry (gap).
            entry.charStart += len
            entry.charEnd += len
          } else if (entry.charEnd > cursor) {
            // Strictly inside: the entry stretches around the insertion.
            entry.charEnd += len
          }
        }
        record.text =
          record.text.slice(0, cursor) + str + record.text.slice(cursor)
        if (str.trim() !== "") {
          insertedTexts.push({ turn, record, text: str, at: cursor })
        }
        cursor += len
        continue
      }

      if (op.delete != null) {
        const n = op.delete
        const delEnd = cursor + n
        // Yjs deltas don't carry deleted content: capture it from the mirror.
        const removedStr = record.text.slice(cursor, delEnd)
        const removedWords = []
        const kept = []
        for (const entry of record.words) {
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
        record.words = kept
        if (removedStr.trim() !== "") {
          removedTexts.push({ text: removedStr, words: removedWords })
        }
        record.text = record.text.slice(0, cursor) + record.text.slice(delEnd)
      }
    }
  }

  /**
   * Diff the fragment children against known records: capture removed turns
   * into removedTexts, create records for added turns and try to adopt a
   * same-batch removed chunk (turn split / re-creation move-matching).
   */
  _reconcileChildren(removedTexts, touched) {
    const current = new Set(this._turnElements())

    for (const [element, record] of [...this.records]) {
      if (current.has(element)) continue
      if (record.text.trim() !== "") {
        removedTexts.push({ text: record.text, words: record.words })
      }
      this.records.delete(element)
    }

    for (const element of current) {
      if (this.records.has(element)) continue
      const record = makeRecord(getElementText(element))
      this.records.set(element, record)
      touched.add(element)

      const tokens = tokenize(record.text)
      if (tokens.length === 0) continue
      for (let i = 0; i < removedTexts.length; i++) {
        const removed = removedTexts[i]
        const removedTokens = tokenize(removed.text)
        if (!sameTokenTexts(tokens, removedTokens)) continue
        // Same words, new home: adopt timings, offsets from the new tokens.
        record.words = transferWords(removed.words, removedTokens, tokens, 0)
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
      if (this.records.get(ins.turn) !== ins.record) continue

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
        ins.record.words = ins.record.words
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
      const record = this.records.get(turn)
      if (!record) continue // removed in the same batch
      const actual = getElementText(turn)
      if (record.text === actual) continue

      console.warn(
        `WordsState: mirror out of sync with doc text (mirror=${record.text.length} chars, doc=${actual.length} chars), realigning turn`,
      )
      const oldWords = record.words.map((e) => ({
        word: e.text,
        stime: e.stime,
        etime: e.etime,
        wid: e.wid,
        confidence: e.confidence,
      }))
      record.words = alignWords(tokenize(actual), oldWords)
      record.text = actual
      record.dirty = true
    }
  }

  // --- Helpers ---

  /** Fragment children that are turn elements, in document order. */
  _turnElements() {
    return this.fragment.toArray().filter((c) => c instanceof Y.XmlElement)
  }

  /** Climb from an event target to the fragment child that contains it. */
  _owningTurn(target) {
    let node = target
    while (node && node.parent && node.parent !== this.fragment) {
      node = node.parent
    }
    return node && node.parent === this.fragment ? node : null
  }
}

function makeRecord(text) {
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
function turnLanguage(element, record) {
  return element.getAttribute("language") || record.language || "fr"
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
