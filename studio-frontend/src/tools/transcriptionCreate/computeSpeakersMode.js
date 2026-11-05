/**
 * What is done with the speakers of a draft.
 * @param {{ isSeparated: boolean, collectionIds: string[] }} speakers - draft.speakers
 * @returns {"none"|"distinguish"|"recognize"}
 */
export function computeSpeakersMode({ isSeparated, collectionIds }) {
  if (!isSeparated) return "none"
  return collectionIds.length > 0 ? "recognize" : "distinguish"
}
