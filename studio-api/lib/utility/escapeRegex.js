/**
 * Escape a string for safe literal inclusion in a regular expression
 * or a MongoDB $regex query.
 * @param {string} str
 * @returns {string}
 */
function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * MongoDB filter matching documents whose field contains the given value,
 * case-insensitively and literally (regex metacharacters are escaped).
 * @param {string} value
 * @returns {object}
 */
function regexContains(value) {
  return { $regex: escapeRegex(value), $options: "i" }
}

module.exports = { escapeRegex, regexContains }
