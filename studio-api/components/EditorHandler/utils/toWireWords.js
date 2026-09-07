// No wid on the wire: clients consume words positionally (token index).
function toWireWords(words) {
  return (words || []).map(({ wid, ...word }) => word)
}

module.exports = { toWireWords }
