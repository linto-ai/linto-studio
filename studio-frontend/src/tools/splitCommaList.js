// "a, b,,c" or ["a", "b"] -> ["a", "b", "c"], trimmed and deduplicated
export function splitCommaList(value) {
  let items = []
  if (Array.isArray(value)) items = value
  else if (typeof value === "string") items = value.split(/[\s,]+/)
  const cleaned = items.map((item) => String(item).trim()).filter(Boolean)
  return [...new Set(cleaned)]
}
