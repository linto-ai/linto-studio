import { SUGGESTED_LANGUAGES } from "../../const/transcriptionCreate.js"
import formatLanguage from "../formatLanguage.js"

/**
 * Language options with their display name, suggested languages first, then
 * the others by name.
 * @param {{ code: string }[]} options
 * @param {string} locale
 * @returns {{ code: string, label: string, group: string }[]}
 *   group: "suggested" | "all"
 */
export function computeLanguageGroups(options, locale) {
  const named = options.map((option) => ({
    ...option,
    label: formatLanguage(option.code, { locale }),
  }))
  return [
    ...named
      .filter((option) => SUGGESTED_LANGUAGES.includes(option.code))
      .sort(
        (a, b) =>
          SUGGESTED_LANGUAGES.indexOf(a.code) -
          SUGGESTED_LANGUAGES.indexOf(b.code),
      )
      .map((option) => ({ ...option, group: "suggested" })),
    ...named
      .filter((option) => !SUGGESTED_LANGUAGES.includes(option.code))
      .sort((a, b) => a.label.localeCompare(b.label, locale))
      .map((option) => ({ ...option, group: "all" })),
  ]
}
