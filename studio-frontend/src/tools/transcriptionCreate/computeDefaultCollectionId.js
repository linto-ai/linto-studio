/**
 * List of speakers to start from: the organization-wide one, which applies by
 * default, otherwise the first.
 * @param {object[]} collections - voiceprint collections
 * @returns {string|null}
 */
export function computeDefaultCollectionId(collections) {
  const organizationCollection = collections.find(
    (collection) => collection.type === "organization",
  )
  return (organizationCollection ?? collections[0])?._id ?? null
}
