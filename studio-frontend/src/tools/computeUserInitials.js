/**
 * Derives up to 2 initials from a display name: first+last name initial when
 * there are several words, otherwise the first 2 characters.
 * @param {string} name
 * @returns {string}
 */
export function computeUserInitials(name) {
  if (!name) return ""
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}
