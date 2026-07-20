const Y = require("yjs")
const crypto = require("crypto")
const debug = require("debug")("linto:components:EditorHandler:turnIds")

/** Transaction origin of the id authority — observers (WordsState, the
 *  authority itself) can recognize and skip server-originated id writes. */
const TURN_ID_ASSIGN_ORIGIN = "linto:assign-turn-ids"

/**
 * The server is the turn-id authority in collab mode: a client may render a
 * freshly split turn with a null id and wait for this observer to assign
 * one (an attribute set is a Yjs LWW — concurrent assignments from several
 * replicas converge, and it can never conflict with text edits).
 *
 * Duplicate ids are repaired too: pasting a copied turn duplicates the id
 * attribute, which would make Mongo's per-turn targeted writes ambiguous.
 * First occurrence keeps the id, later ones get fresh ones (document order).
 *
 * @param {Y.XmlFragment} turnsFragment
 * @returns {() => void} detach
 */
function attachTurnIdAuthority(turnsFragment) {
  const doc = turnsFragment.doc
  let scheduled = false

  const assignIds = () => {
    scheduled = false
    const seen = new Set()
    const fixes = []
    for (const el of turnsFragment.toArray()) {
      if (!(el instanceof Y.XmlElement) || el.nodeName !== "turn") continue
      const id = el.getAttribute("id")
      if (!id || seen.has(id)) fixes.push(el)
      else seen.add(id)
    }
    if (fixes.length === 0) return
    doc.transact(() => {
      for (const el of fixes) el.setAttribute("id", crypto.randomUUID())
    }, TURN_ID_ASSIGN_ORIGIN)
    debug(`assigned ${fixes.length} turn id(s)`)
  }

  const observer = (_events, transaction) => {
    if (transaction.origin === TURN_ID_ASSIGN_ORIGIN) return
    if (scheduled) return
    scheduled = true
    // Microtask: never mutate the doc from inside an observer call.
    queueMicrotask(assignIds)
  }

  // Shallow observe: only the turnsFragment's child list can introduce a
  // missing/duplicate id (attribute/text edits cannot).
  turnsFragment.observe(observer)
  assignIds() // repair anything already present at load (defensive)
  return () => turnsFragment.unobserve(observer)
}

module.exports = { attachTurnIdAuthority, TURN_ID_ASSIGN_ORIGIN }
