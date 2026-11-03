import { AUTO_LANGUAGE } from "../../const/transcriptionCreate.js"
import { computeProfileLanguages } from "./computeProfileLanguages.js"
import { computeServiceLanguage } from "./computeServiceLanguage.js"
import { isLiveRequested } from "./isLiveRequested.js"
import { isOfflineRequested } from "./isOfflineRequested.js"

/**
 * What the chosen languages won't quite do: in live the profile hears all its
 * languages, no more and no less, and a service detecting instead of following
 * the chosen languages may find others.
 * @param {object} draft
 * @param {{ profile: object|null, service: object|null }} engines
 * @returns {{ key: string, languages?: string[] }[]}
 *   key: "live_detects_only" | "offline_detects_any"
 */
export function computeLanguageWarnings(draft, { profile, service }) {
  const warnings = []
  if (
    isLiveRequested(draft) &&
    profile &&
    hearsOtherLanguages(profile, draft)
  ) {
    warnings.push({
      key: "live_detects_only",
      languages: computeProfileLanguages(profile),
    })
  }
  if (
    isOfflineRequested(draft) &&
    service &&
    !draft.languages.includes(AUTO_LANGUAGE) &&
    computeServiceLanguage(service, draft.languages) === AUTO_LANGUAGE
  ) {
    warnings.push({ key: "offline_detects_any" })
  }
  return warnings
}

function hearsOtherLanguages(profile, draft) {
  return computeProfileLanguages(profile).some(
    (code) => !draft.languages.includes(code),
  )
}
