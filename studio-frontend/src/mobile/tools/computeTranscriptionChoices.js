import { pickRecommendedService } from "./pickRecommendedService.js"
import { DEFAULT_MEMBERS_RIGHT } from "../const/defaultMembersRight.js"

/**
 * The transcription and sharing choices to start from, given the services
 * offered and what was remembered for the organization: the remembered
 * service if still offered, its language if the service supports it, else
 * the app language, else the service's first language.
 * @param {object[]} services - GET /services
 * @param {object|null} saved - readTranscriptionPreferences()
 * @param {string} locale - app locale, e.g. "fr-FR"
 * @returns {{ serviceName: string|null, language: string, diarization: boolean, voiceCollections: string[], membersRight: number, folderId: string|null }}
 */
export function computeTranscriptionChoices(services, saved, locale) {
  const service = pickRecommendedService(services, saved?.serviceName)
  const languages = (service?.language || "*").split(",")
  const appLanguage = languages.find((code) =>
    code.startsWith(locale.slice(0, 2)),
  )
  return {
    serviceName: service?.serviceName ?? null,
    language: languages.includes(saved?.language)
      ? saved.language
      : (appLanguage ?? languages[0]),
    diarization: saved?.diarization ?? true,
    // Not restored from storage: a deleted collection would be sent.
    voiceCollections: [],
    membersRight: saved?.membersRight ?? DEFAULT_MEMBERS_RIGHT,
    folderId: saved?.folderId ?? null,
  }
}
