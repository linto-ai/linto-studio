import type { Channel, Translation } from "../../types/editor"
import { findSourceTranslation } from "./findSourceTranslation"

export function findActiveTranslation(
  channel: Channel,
  translationId: string | null,
): Translation {
  const source = findSourceTranslation(channel)
  if (!translationId) return source
  return channel.translations.find((t) => t.id === translationId) ?? source
}
