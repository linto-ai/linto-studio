/**
 * Up to two initials from a display name: first and last word when there
 * are several, otherwise the first two characters.
 * @param {string} name
 * @returns {string}
 */
export function computeInitials(name) {
  if (!name) return ""
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return parts[0].substring(0, 2).toUpperCase()
}
