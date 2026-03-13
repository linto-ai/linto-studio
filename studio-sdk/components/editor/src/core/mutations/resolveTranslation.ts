import type { Channel, EditorDocument, Translation } from "../../types/editor"
import type { TurnTarget } from "../types"
import { findSourceTranslation } from "./findSourceTranslation"

export function resolveTranslation(
  document: EditorDocument,
  activeChannel: Channel,
  target?: TurnTarget,
): Translation | null {
  const channel = target?.channelId
    ? document.channels.find((c) => c.id === target.channelId)
    : activeChannel

  if (!channel) return null

  if (target?.translationId) {
    return (
      channel.translations.find((t) => t.id === target.translationId) ?? null
    )
  }

  return findSourceTranslation(channel)
}
