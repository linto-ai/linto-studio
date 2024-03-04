export default function getWordsRangeFromTagMetadata(tag) {
  if (!tag || !tag.metadata) return []

  return tag.metadata
    .filter((m) => m.schema == "words")
    .flatMap((m) => m.value?.range_id || [])
}
