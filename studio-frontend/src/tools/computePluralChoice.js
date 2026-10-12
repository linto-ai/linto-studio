/**
 * The choice to pass to vue-i18n's $tc for a two-form message
 * ("singular | plural"), by the plural rule of the locale: French reads 0
 * and 1 as singular, English only 1. vue-i18n alone reads 0 as plural in
 * every locale.
 * @param {number} count
 * @param {string} locale - e.g. "fr-FR"
 * @returns {1|2}
 */
export function computePluralChoice(count, locale) {
  return new Intl.PluralRules(locale).select(count) === "one" ? 1 : 2
}
