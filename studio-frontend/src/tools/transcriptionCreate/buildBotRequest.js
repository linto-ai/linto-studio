import { isLiveRequested } from "./isLiveRequested.js"

/**
 * What apiStartBot expects for a visio draft. Subtitles come from the live
 * transcription: without it, there is nothing to display.
 * @param {object} draft
 * @param {string} channelId - channel of the quick session
 * @returns {object}
 */
export function buildBotRequest(draft, channelId) {
  const { url, provider, showSubtitles, subtitleSource } = draft.visio
  const live = isLiveRequested(draft)
  return {
    // Only trimmed: meeting URLs carry case-sensitive tokens.
    url: url.trim(),
    channelId,
    enableDisplaySub: live && showSubtitles,
    subSource: live && subtitleSource !== "original" ? subtitleSource : null,
    provider,
  }
}
