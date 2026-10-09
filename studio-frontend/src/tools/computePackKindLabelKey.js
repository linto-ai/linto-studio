/**
 * i18n key of the name of a kind of pack. A pack that also grants AI credits
 * reads as such ("Files + AI"), whatever its kind.
 * @param {{kind: string, hasAiCredits?: boolean}} pack
 * @returns {string}
 */
export function computePackKindLabelKey({ kind, hasAiCredits = false }) {
  if (hasAiCredits) return "billing.settings.packs.kind_with_ai"
  return `billing.settings.packs.kind.${kind}`
}
