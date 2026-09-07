import type { Core, TranslationStore } from "@linto-ai/transcript-ui-core"

/** A translation store by id, across every channel — server broadcasts may
 *  target a track the user is not looking at. */
export function findTranslationStore(
  core: Core,
  translationId: string,
): TranslationStore | undefined {
  for (const channel of core.channels.values()) {
    const store = channel.translations.get(translationId)
    if (store) return store
  }
  return undefined
}
