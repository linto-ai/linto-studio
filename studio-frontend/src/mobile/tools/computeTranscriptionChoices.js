import { DEFAULT_MEMBERS_RIGHT } from "../const/defaultMembersRight.js"

/**
 * The choices to start from: the remembered language if the first service
 * supports it, else the app language, else the service's first language.
 * @param {object[]} services - GET /services
 * @param {object|null} saved - readTranscriptionPreferences()
 * @param {string} locale - app locale, e.g. "fr-FR"
 * @returns {{ language: string, diarization: boolean, voiceCollections: string[], hotwordDictionaries: string[], membersRight: number, folderId: string|null }}
 */
export function computeTranscriptionChoices(services, saved, locale) {
  const languages = (services[0]?.language || "*").split(",")
  const appLanguage = languages.find((code) =>
    code.startsWith(locale.slice(0, 2)),
  )
  return {
    language: languages.includes(saved?.language)
      ? saved.language
      : (appLanguage ?? languages[0]),
    diarization: saved?.diarization ?? true,
    // Not restored from storage: a deleted one would be sent.
    voiceCollections: [],
    hotwordDictionaries: [],
    membersRight: saved?.membersRight ?? DEFAULT_MEMBERS_RIGHT,
    folderId: saved?.folderId ?? null,
  }
}
