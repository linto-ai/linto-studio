import { AUTO_LANGUAGE } from "../../const/transcriptionCreate.js"
import { computeLanguageCode } from "../computeLanguageCode.js"
import { computeLanguageSelection } from "./computeLanguageSelection.js"
import { computeProfileLanguages } from "./computeProfileLanguages.js"
import { computeServiceLanguages } from "./computeServiceLanguages.js"
import { isLanguageSelectionPossible } from "./isLanguageSelectionPossible.js"
import { isLiveRequested } from "./isLiveRequested.js"
import { isOfflineRequested } from "./isOfflineRequested.js"

/**
 * Languages to offer for a draft: those an engine exists for once added to
 * the selection, detection first. A chosen language is always listed, so that
 * it can be removed.
 * @param {object} draft
 * @param {{ profiles: object[], services: object[] }} catalog
 * @returns {string[]}
 */
export function computeOfferedLanguageCodes(draft, catalog) {
  return [AUTO_LANGUAGE, ...computeExplicitCodes(draft, catalog)].filter(
    (code) =>
      draft.languages.includes(code) ||
      isLanguageSelectionPossible(
        draft,
        catalog,
        computeLanguageSelection(draft.languages, [...draft.languages, code]),
      ),
  )
}

function computeExplicitCodes(draft, catalog) {
  const fromProfiles = isLiveRequested(draft)
    ? catalog.profiles.flatMap(computeProfileLanguages)
    : []
  const fromServices = isOfflineRequested(draft)
    ? catalog.services.flatMap(computeServiceLanguages).map(computeLanguageCode)
    : []
  const codes = new Set([...fromProfiles, ...fromServices, ...draft.languages])
  codes.delete(AUTO_LANGUAGE)
  return [...codes]
}
