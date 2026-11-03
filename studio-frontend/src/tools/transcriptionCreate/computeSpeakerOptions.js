import { computeDiarizationServiceName } from "./computeDiarizationServiceName.js"
import { isLiveRequested } from "./isLiveRequested.js"
import { isOfflineRequested } from "./isOfflineRequested.js"

/**
 * The speakers modes to offer for a draft. "recognize" only happens at the
 * end, and only with a capable service and a list of speakers: it isn't
 * offered otherwise. In live, speakers can at best be told apart.
 * @param {object} draft
 * @param {{ profile: object|null, service: object|null }} engines
 * @param {{ collections: object[], speakerIdentificationEnabled: boolean }} catalog
 * @returns {{ name: string, disabled: boolean, notice: string|null }[]}
 *   notice: "after_recording_only" | "during_recording_only" | "named_after_recording"
 *     | "engine_unsupported" | null
 */
export function computeSpeakerOptions(draft, engines, catalog) {
  const options = [
    { name: "none", disabled: false, notice: null },
    computeDistinguishOption(draft, engines),
  ]
  if (canRecognize(draft, engines.service, catalog)) {
    options.push({
      name: "recognize",
      disabled: false,
      notice: computeRecognizeNotice(draft, engines.profile),
    })
  }
  return options
}

function computeDistinguishOption(draft, { profile, service }) {
  const inLive = isLiveRequested(draft) && liveSeparates(profile)
  const atTheEnd =
    isOfflineRequested(draft) &&
    computeDiarizationServiceName(service, "distinguish") !== null
  if (!inLive && !atTheEnd) {
    return { name: "distinguish", disabled: true, notice: "engine_unsupported" }
  }
  return {
    name: "distinguish",
    disabled: false,
    notice: computeDistinguishNotice(draft, inLive, atTheEnd),
  }
}

function computeDistinguishNotice(draft, inLive, atTheEnd) {
  if (isLiveRequested(draft) && !inLive) return "after_recording_only"
  if (isOfflineRequested(draft) && !atTheEnd) return "during_recording_only"
  return null
}

function computeRecognizeNotice(draft, profile) {
  if (!isLiveRequested(draft)) return null
  return liveSeparates(profile)
    ? "named_after_recording"
    : "after_recording_only"
}

function canRecognize(
  draft,
  service,
  { collections, speakerIdentificationEnabled },
) {
  return (
    speakerIdentificationEnabled &&
    isOfflineRequested(draft) &&
    collections.length > 0 &&
    computeDiarizationServiceName(service, "recognize") !== null
  )
}

function liveSeparates(profile) {
  return profile?.config?.hasDiarization === true
}
