/**
 * Escape a string for safe literal inclusion in a regular expression
 * or a MongoDB $regex query.
 * @param {string} str
 * @returns {string}
 */
function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

module.exports = { escapeRegex }
