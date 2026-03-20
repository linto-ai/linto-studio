import type { Turn } from "../../types/editor"

export function removeTurn(turns: Turn[], turnId: string): Turn[] | null {
  const idx = turns.findIndex((t) => t.id === turnId)
  if (idx === -1) return null
  return turns.filter((_, i) => i !== idx)
}
