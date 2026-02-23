export function extractTranslationLangCode(translation) {
  return typeof translation === 'string' ? translation : translation.target
}

export function normalizeAvailableTranslations(raw) {
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  const discrete = raw.discrete || []
  const external = (raw.external || []).flatMap(e => e.languages || [])
  return [...new Set([...discrete, ...external])]
}

export function isQualifiedForCrossSubtitles(translations, languages) {
  if (!languages || languages.length !== 2) return false
  const langCodes = translations.map(extractTranslationLangCode)
  return (
    !!langCodes.find(t => t.split('-')[0] === languages[0].split('-')[0]) &&
    !!langCodes.find(t => t.split('-')[0] === languages[1].split('-')[0])
  )
}
