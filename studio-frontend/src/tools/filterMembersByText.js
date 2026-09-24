function normalize(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
}

/**
 * Filters members on their name and e-mail, ignoring case and diacritics, so
 * that "jerome" finds "Jérôme". An empty search returns the list untouched.
 * @param {Array<{firstname?: string, lastname?: string, email?: string}>} members
 * @param {string} text
 * @returns {Array} the matching members
 */
export function filterMembersByText(members, text) {
  const needle = normalize(text).trim()
  if (!needle) return members || []
  return (members || []).filter((member) => {
    const haystack = normalize(
      `${member.firstname ?? ""} ${member.lastname ?? ""} ${member.email ?? ""}`,
    )
    return haystack.includes(needle)
  })
}
