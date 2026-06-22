// Maps a language code to a localized, capitalized display name.
// "*" (auto-detect) or an empty value returns `autoLabel`.
export default function formatLanguage(lang, { locale, autoLabel } = {}) {
  if (!lang || lang === "*") return autoLabel ?? lang ?? ""
  try {
    const names = new Intl.DisplayNames([locale], { type: "language" })
    return names.of(lang).replace(/^./, (char) => char.toUpperCase())
  } catch (error) {
    return lang
  }
}
