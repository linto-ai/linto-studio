import { computeDiarizationServiceName } from "./computeDiarizationServiceName.js"
import { isLiveRequested } from "./isLiveRequested.js"
import { isOfflineRequested } from "./isOfflineRequested.js"

/**
 * The speakers settings to offer for a draft. Identification only happens at
 * the end, and only with a capable service and a list of speakers. In live,
 * speakers can at best be told apart, and their number can't be set.
 * @param {object} draft
 * @param {{ profile: object|null, service: object|null }} engines
 * @param {{ collections: object[], speakerIdentificationEnabled: boolean }} catalog
 * @returns {{
 *   separation: { isAvailable: boolean, notice: string|null },
 *   isCountAvailable: boolean,
 *   identification: { isAvailable: boolean, notice: string|null },
 * }}
 *   notice: "after_recording_only" | "during_recording_only" | "named_after_recording"
 *     | "engine_unsupported" | null
 */
export function computeSpeakerOptions(draft, engines, catalog) {
  return {
    separation: computeSeparationOption(draft, engines),
    isCountAvailable:
      isOfflineRequested(draft) && canSeparateAtTheEnd(engines.service),
    identification: computeIdentificationOption(draft, engines, catalog),
  }
}

function computeSeparationOption(draft, { profile, service }) {
  const inLive = isLiveRequested(draft) && liveSeparates(profile)
  const atTheEnd = isOfflineRequested(draft) && canSeparateAtTheEnd(service)
  if (!inLive && !atTheEnd) {
    return { isAvailable: false, notice: "engine_unsupported" }
  }
  return {
    isAvailable: true,
    notice: computeSeparationNotice(draft, inLive, atTheEnd),
  }
}

function computeSeparationNotice(draft, inLive, atTheEnd) {
  if (isLiveRequested(draft) && !inLive) return "after_recording_only"
  if (isOfflineRequested(draft) && !atTheEnd) return "during_recording_only"
  return null
}

function computeIdentificationOption(draft, { profile, service }, catalog) {
  if (!canIdentify(draft, service, catalog)) {
    return { isAvailable: false, notice: null }
  }
  return {
    isAvailable: true,
    notice: computeIdentificationNotice(draft, profile),
  }
}

function computeIdentificationNotice(draft, profile) {
  if (!isLiveRequested(draft)) return null
  return liveSeparates(profile)
    ? "named_after_recording"
    : "after_recording_only"
}

function canIdentify(
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

function canSeparateAtTheEnd(service) {
  return computeDiarizationServiceName(service, "distinguish") !== null
}

function liveSeparates(profile) {
  return profile?.config?.hasDiarization === true
}
