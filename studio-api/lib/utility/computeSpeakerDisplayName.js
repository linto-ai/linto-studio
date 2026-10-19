// Label shown in place of a generated placeholder name, per interface language.
const PLACEHOLDER_LABELS = {
  fr: "Intervenant",
  en: "Speaker",
}
const FALLBACK_LANGUAGE = "en"

/**
 * Name to render for a speaker in a human-readable output. Only `defined ===
 * false` marks a generated placeholder ("spk2", "speaker3", "Unknown speaker
 * 2"): it is shown as a label in the interface language, numbered with the
 * trailing digits of the stored name. A missing flag (legacy data) means a
 * real name, rendered as stored.
 * @param {{speaker_name: string, defined?: boolean}} speaker
 * @param {string} [locale] interface locale ("fr-FR", "en-US", "fr"...);
 *   unknown or missing falls back to English
 * @returns {string}
 */
function computeSpeakerDisplayName(speaker, locale) {
  const name = speaker?.speaker_name ?? ""
  if (speaker?.defined !== false) return name

  const language = String(locale || "")
    .split(/[-_]/)[0]
    .toLowerCase()
  const label =
    PLACEHOLDER_LABELS[language] ?? PLACEHOLDER_LABELS[FALLBACK_LANGUAGE]

  const digits = /(\d+)\s*$/.exec(name)
  return digits ? `${label} ${parseInt(digits[1], 10)}` : label
}

module.exports = { computeSpeakerDisplayName }
