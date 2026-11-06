import { buildQuickSessionChannel } from "../session/buildQuickSessionChannel.js"
import { buildServiceConfig } from "./buildServiceConfig.js"
import { isLiveRequested } from "./isLiveRequested.js"
import { isOfflineRequested } from "./isOfflineRequested.js"

/**
 * What apiCreateQuickSession expects for a microphone or visio draft. In live,
 * speakers are told apart at best: naming them is left to the end version.
 * @param {object} draft
 * @param {{ profile: object|null, service: object|null }} engines
 * @returns {{ channels: object[], meta: object }}
 */
export function buildQuickSessionRequest(draft, { profile, service }) {
  const live = isLiveRequested(draft)
  const offline = isOfflineRequested(draft)
  const channel = buildQuickSessionChannel({
    subInStudio: live,
    offlineTranscription: offline,
    keepAudio: draft.keepAudio,
    diarization:
      live &&
      draft.speakers.isSeparated &&
      profile?.config?.hasDiarization === true,
    selectedProfile: live
      ? { ...profile, translations: draft.translations }
      : null,
    transcriptionService: offline ? buildServiceConfig(draft, service) : null,
  })
  return {
    channels: [channel],
    meta: {
      securityLevel: draft.securityLevel,
      membersRight: draft.membersRight,
    },
  }
}
