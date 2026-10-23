// Clicking the sorted column flips its direction; a new column starts
// descending.
export function computeNextSort(current, key) {
  if (key !== current.key) return { key, direction: "desc" }
  return { key, direction: current.direction === "desc" ? "asc" : "desc" }
}
