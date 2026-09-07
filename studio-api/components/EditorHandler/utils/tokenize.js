/**
 * Tokenization contract shared with the front-end (wire payloads align by
 * token index): a token is a maximal run of non-whitespace. Offsets are
 * UTF-16 indices and never leave the process.
 */

const TOKEN_RE = /\S+/g

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
