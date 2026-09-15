const MAX_SUGGESTIONS = 6

/**
 * Translation targets worth showing first: the languages the profile can
 * hear (config.languages candidates), when they are also available targets.
 * @param {{ config?: { languages?: { candidate: string }[] } }} profile
 * @param {{ code: string, label: string }[]} options - every available target
 * @returns {{ code: string, label: string }[]} at most MAX_SUGGESTIONS
 */
export function suggestTranslationTargets(profile, options) {
  const spoken = (profile?.config?.languages ?? []).map(
    (language) => (language.candidate || "").split("-")[0],
  )
  return options
    .filter((option) => spoken.includes(option.code.split("-")[0]))
    .slice(0, MAX_SUGGESTIONS)
}
