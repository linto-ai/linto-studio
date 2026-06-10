export function equalsIgnoreCase(a, b) {
  return String(a ?? "").toLowerCase() === String(b ?? "").toLowerCase()
}
