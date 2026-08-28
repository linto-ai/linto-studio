import type { Core, TranslationStore } from "@linto-ai/transcript-ui-core"

/** The edited text belongs to ONE language track: the active translation
 *  (cross mode has no mutable store and is not editable). */
export function getActiveTranslationStore(
  core: Core,
): TranslationStore | undefined {
  const channel = core.activeChannel.value
  if (!channel) return undefined
  return channel.translations.get(channel.activeTranslation.value.id)
}
