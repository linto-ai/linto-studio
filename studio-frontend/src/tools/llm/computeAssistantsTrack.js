/**
 * The track the AI assistants (reports, chat, exports) work on in a channel:
 * the displayed one, each track being a conversation of its own. The bilingual
 * "cross" view is virtual (no conversation behind it): it falls back on the
 * source track.
 * @param {object} channel - SDK channel store
 * @returns {object} the SDK translation store of the track
 */
export function computeAssistantsTrack(channel) {
  const activeId = channel.activeTranslation.value.id
  return channel.translations.get(activeId) ?? channel.sourceTranslation
}
