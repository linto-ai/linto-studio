// One word per line or between commas: a word may hold spaces
export function parseHotwords(text) {
  const seen = new Set()
  return String(text ?? "")
    .split(/[\n,]+/)
    .map((word) => word.trim().replace(/\s+/g, " "))
    .filter((word) => {
      const key = word.toLowerCase()
      if (word === "" || seen.has(key)) return false
      seen.add(key)
      return true
    })
}
