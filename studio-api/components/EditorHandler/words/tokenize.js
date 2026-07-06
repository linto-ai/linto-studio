/**
 * THE tokenization contract, shared by contract with the front-end: a word
 * token is a maximal run of non-whitespace characters. Client and server MUST
 * tokenize identically — word/timestamp payloads are aligned by token index,
 * with no wid and no character offsets on the wire.
 *
 * Offsets are expressed in UTF-16 code units (plain JS string indices),
 * relative to the turn's own text. They never leave the process: each side
 * derives its own from its own copy of the text.
 */

const TOKEN_RE = /\S+/g

/**
 * @param {string} text - a turn's plain text
 * @returns {Array<{text: string, charStart: number, charEnd: number}>}
 */
function tokenize(text) {
  const tokens = []
  if (!text) return tokens
  let m
  TOKEN_RE.lastIndex = 0
  while ((m = TOKEN_RE.exec(text)) !== null) {
    tokens.push({
      text: m[0],
      charStart: m.index,
      charEnd: m.index + m[0].length,
    })
  }
  return tokens
}

module.exports = { tokenize }
