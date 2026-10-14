// The language of a BCP 47 locale, without its region: "en-US" → "en". The
// editor web component only knows bare languages ("fr", "en"). An unparsable
// value comes back unchanged.
export function computeLanguageCode(locale) {
  try {
    return new Intl.Locale(locale).language
  } catch {
    return locale
  }
}
