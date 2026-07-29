/** Inverse of wordId: split a `turnId#index` key back into its parts. */
export function parseWordId(
  id: string,
): { turnId: string; index: number } | null {
  const sep = id.lastIndexOf("#")
  if (sep <= 0) return null
  const raw = id.slice(sep + 1)
  // Number("") is 0 — an empty index must not parse as word 0.
  if (raw === "") return null
  const index = Number(raw)
  if (!Number.isInteger(index) || index < 0) return null
  return { turnId: id.slice(0, sep), index }
}
