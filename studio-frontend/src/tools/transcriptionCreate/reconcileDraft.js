import { AUTO_LANGUAGE } from "../../const/transcriptionCreate.js"
import { computeCompatibleProfiles } from "./computeCompatibleProfiles.js"
import { computeCompatibleServices } from "./computeCompatibleServices.js"
import { computeDefaultCollectionId } from "./computeDefaultCollectionId.js"
import { computeDefaultProfile } from "./computeDefaultProfile.js"
import { computeDefaultService } from "./computeDefaultService.js"
import { computeDraftEngines } from "./computeDraftEngines.js"
import { computeOfferedLanguageCodes } from "./computeOfferedLanguageCodes.js"
import { computeProfileTranslations } from "./computeProfileTranslations.js"
import { computeSpeakerOptions } from "./computeSpeakerOptions.js"
import { computeTimingOptions } from "./computeTimingOptions.js"
import { isLanguageSelectionPossible } from "./isLanguageSelectionPossible.js"
import { isLiveRequested } from "./isLiveRequested.js"
import { isOfflineRequested } from "./isOfflineRequested.js"

// Each choice constrains the next ones: never the other way around.
const STEPS = [
  reconcileTiming,
  reconcileLanguages,
  reconcileTranslations,
  reconcileProfile,
  reconcileService,
  reconcileSpeakers,
  reconcileKeepAudio,
  reconcileSubtitleSource,
]

/**
 * Brings a draft back to what the organization offers after any change, and
 * tells what had to change among the user's own choices.
 * @param {object} draft - see createDraft
 * @param {{ profiles: object[], services: object[], collections: object[], speakerIdentificationEnabled: boolean }} catalog
 * @returns {{ draft: object, notices: { key: string, codes?: string[] }[] }}
 *   notice key: "languages_changed" | "translations_removed" | "profile_changed"
 *     | "service_changed" | "speakers_changed"
 */
export function reconcileDraft(draft, catalog) {
  const notices = []
  const reconciled = STEPS.reduce(
    (current, step) => step(current, catalog, notices),
    draft,
  )
  return { draft: reconciled, notices }
}

function isOptionOffered(options, name) {
  return options.some((option) => option.name === name && !option.disabled)
}

function reconcileTiming(draft, catalog) {
  const options = computeTimingOptions(draft.securityLevel, catalog)
  if (isOptionOffered(options, draft.timing)) return draft
  const fallback = ["both", "offline", "live"].find((name) =>
    isOptionOffered(options, name),
  )
  return { ...draft, timing: fallback ?? draft.timing }
}

function reconcileLanguages(draft, catalog, notices) {
  if (isLanguageSelectionPossible(draft, catalog, draft.languages)) return draft
  const languages = computeFallbackLanguages(draft, catalog)
  if (!languages) return draft
  if (!draft.languages.includes(AUTO_LANGUAGE)) {
    notices.push({ key: "languages_changed", codes: draft.languages })
  }
  return { ...draft, languages }
}

// Detection when an engine can do it, otherwise the first language offered.
function computeFallbackLanguages(draft, catalog) {
  if (isLanguageSelectionPossible(draft, catalog, [AUTO_LANGUAGE])) {
    return [AUTO_LANGUAGE]
  }
  const firstCode = computeOfferedLanguageCodes(
    { ...draft, languages: [AUTO_LANGUAGE] },
    catalog,
  ).find((code) => code !== AUTO_LANGUAGE)
  return firstCode ? [firstCode] : null
}

function reconcileTranslations(draft, catalog, notices) {
  if (!isLiveRequested(draft)) return draft
  const profiles = computeCompatibleProfiles(catalog.profiles, {
    ...draft,
    translations: [],
  })
  const kept = computeKeptTranslations(profiles, draft.translations)
  if (kept.length === draft.translations.length) return draft
  notices.push({
    key: "translations_removed",
    codes: draft.translations.filter((code) => !kept.includes(code)),
  })
  return { ...draft, translations: kept }
}

// In their order, the translations a single profile can still offer together.
function computeKeptTranslations(profiles, translations) {
  const kept = []
  for (const code of translations) {
    if (profiles.some((profile) => offersAll(profile, [...kept, code]))) {
      kept.push(code)
    }
  }
  return kept
}

function offersAll(profile, translations) {
  const offered = computeProfileTranslations(profile)
  return translations.every((code) => offered.includes(code))
}

function reconcileProfile(draft, catalog, notices) {
  if (!isLiveRequested(draft)) return draft
  const compatible = computeCompatibleProfiles(catalog.profiles, draft)
  const isCurrentCompatible = compatible.some((p) => p.id === draft.profileId)
  if (draft.profileChosenByUser && isCurrentCompatible) return draft
  if (draft.profileChosenByUser) notices.push({ key: "profile_changed" })
  const profile = computeDefaultProfile(compatible, draft.languages)
  return {
    ...draft,
    profileId: profile?.id ?? null,
    profileChosenByUser: false,
  }
}

function reconcileService(draft, catalog, notices) {
  if (!isOfflineRequested(draft)) return draft
  const compatible = computeCompatibleServices(catalog.services, draft)
  const isCurrentCompatible = compatible.some(
    (service) => service.serviceName === draft.serviceName,
  )
  if (draft.serviceChosenByUser && isCurrentCompatible) return draft
  if (draft.serviceChosenByUser) notices.push({ key: "service_changed" })
  const service = computeDefaultService(compatible, draft.languages)
  return {
    ...draft,
    serviceName: service?.serviceName ?? null,
    serviceChosenByUser: false,
  }
}

function reconcileSpeakers(draft, catalog, notices) {
  const options = computeSpeakerOptions(
    draft,
    computeDraftEngines(draft, catalog),
    catalog,
  )
  const isChoiceKept =
    draft.speakersChosenByUser && isOptionOffered(options, draft.speakers.mode)
  if (draft.speakersChosenByUser && !isChoiceKept) {
    notices.push({ key: "speakers_changed" })
  }
  const mode = isChoiceKept
    ? draft.speakers.mode
    : isOptionOffered(options, "distinguish")
      ? "distinguish"
      : "none"
  return {
    ...draft,
    speakers: {
      mode,
      collectionId: computeCollectionId(draft, mode, catalog.collections),
    },
    speakersChosenByUser: isChoiceKept,
  }
}

function computeCollectionId(draft, mode, collections) {
  if (mode !== "recognize") return null
  const { collectionId } = draft.speakers
  return collections.some((collection) => collection._id === collectionId)
    ? collectionId
    : computeDefaultCollectionId(collections)
}

// The version made at the end needs the audio.
function reconcileKeepAudio(draft) {
  return draft.timing === "live" ? draft : { ...draft, keepAudio: true }
}

function reconcileSubtitleSource(draft) {
  const { subtitleSource } = draft.visio
  if (
    subtitleSource === "original" ||
    draft.translations.includes(subtitleSource)
  ) {
    return draft
  }
  return { ...draft, visio: { ...draft.visio, subtitleSource: "original" } }
}
