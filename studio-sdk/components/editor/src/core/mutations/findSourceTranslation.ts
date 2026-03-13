import type { Channel, Translation } from "../../types/editor"

export function findSourceTranslation(channel: Channel): Translation {
  return channel.translations.find((t) => t.isSource) ?? channel.translations[0]!
}
