// Words+timestamps live outside the Y.Doc; delivered as a stateless message.
// Turns whose server-assigned id hasn't landed yet are skipped — the next
// flush broadcasts them (the id authority converges within a microtask anyway).
function buildWordsPayload(turns) {
  return (turns || [])
    .filter((t) => t.turn_id && Array.isArray(t.words) && t.words.length > 0)
    .map((t) => ({ turn_id: t.turn_id, words: t.words }))
}

module.exports = { buildWordsPayload }
