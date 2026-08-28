/** Initials shown in a user avatar: first letter of the first two words,
 *  uppercased — "Marie Dupont" → "MD", "marie" → "M", "" → "?". */
export function computeInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return "?"
  return words
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("")
}
