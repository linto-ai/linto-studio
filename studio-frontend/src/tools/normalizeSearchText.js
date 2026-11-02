/**
 * Text as a search compares it: without case nor accents ("Néerlandais" and
 * "neerlandais" match).
 * @param {string} text
 * @returns {string}
 */
export function normalizeSearchText(text) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
}
