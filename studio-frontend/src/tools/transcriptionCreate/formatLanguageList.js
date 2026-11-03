import { AUTO_LANGUAGE } from "../../const/transcriptionCreate.js"
import formatLanguage from "../formatLanguage.js"

/**
 * A list of languages as a sentence fragment: "French, English and German".
 * Detection is left out: it isn't a language.
 * @param {string[]} codes
 * @param {string} locale
 * @returns {string}
 */
export function formatLanguageList(codes, locale) {
  const names = codes
    .filter((code) => code !== AUTO_LANGUAGE)
    .map((code) => formatLanguage(code, { locale }))
  return new Intl.ListFormat(locale, { type: "conjunction" }).format(names)
}
