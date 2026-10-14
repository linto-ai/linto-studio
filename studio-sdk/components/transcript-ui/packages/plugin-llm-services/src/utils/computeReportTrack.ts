import type {
  ChannelStore,
  TranslationStore,
} from "@linto-ai/transcript-ui-core"

/** The track the reports of a channel are generated from: the displayed one,
 *  each track being a conversation of its own on the host side. The bilingual
 *  "cross" view is virtual (no conversation behind it): it falls back on the
 *  source track. */
export function computeReportTrack(
  channel: Pick<
    ChannelStore,
    "translations" | "sourceTranslation" | "activeTranslation"
  >,
): TranslationStore {
  const activeId = channel.activeTranslation.value.id
  return channel.translations.get(activeId) ?? channel.sourceTranslation
}
