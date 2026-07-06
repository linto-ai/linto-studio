const Y = require("yjs")
const crypto = require("crypto")
const debug = require("debug")("linto:components:EditorHandler:turnIds")

/** Transaction origin of the minter — observers (WordsState, the minter
 *  itself) can recognize and skip server-originated id writes. */
const MINT_ORIGIN = "linto:mint-turn-ids"

/**
 * The server is the only turn-id minter in collab mode: the client renders a
 * freshly split turn with a null id and waits for this observer to assign
 * one (an attribute set is a Yjs LWW — concurrent mints from several
 * replicas converge, and it can never conflict with text edits).
 *
 * Duplicate ids are repaired too: pasting a copied turn duplicates the id
 * attribute, which would make Mongo's per-turn targeted writes ambiguous.
 * First occurrence keeps the id, later ones get fresh ones (document order).
 *
 * @param {Y.XmlFragment} fragment
 * @returns {() => void} detach
 */
function attachTurnIdMinter(fragment) {
  const doc = fragment.doc
  let scheduled = false

  const mint = () => {
    scheduled = false
    const seen = new Set()
    const fixes = []
    for (const el of fragment.toArray()) {
      if (!(el instanceof Y.XmlElement) || el.nodeName !== "turn") continue
      const id = el.getAttribute("id")
      if (!id || seen.has(id)) fixes.push(el)
      else seen.add(id)
    }
    if (fixes.length === 0) return
    doc.transact(() => {
      for (const el of fixes) el.setAttribute("id", crypto.randomUUID())
    }, MINT_ORIGIN)
    debug(`minted ${fixes.length} turn id(s)`)
  }

  const observer = (_events, transaction) => {
    if (transaction.origin === MINT_ORIGIN) return
    if (scheduled) return
    scheduled = true
    // Microtask: never mutate the doc from inside an observer call.
    queueMicrotask(mint)
  }

  // Shallow observe: only the fragment's child list can introduce a
  // missing/duplicate id (attribute/text edits cannot).
  fragment.observe(observer)
  mint() // repair anything already present at load (defensive)
  return () => fragment.unobserve(observer)
}

module.exports = { attachTurnIdMinter, MINT_ORIGIN }
