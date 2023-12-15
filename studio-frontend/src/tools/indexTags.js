export async function indexTags(tags) {
  const indexedTags = {}
  for (const tag of tags) {
    indexedTags[tag._id] = tag
  }
  return indexedTags
}
