/**
 * The organization the mobile app opens on: the favorite one when the user
 * designated one, otherwise the user's own personal space, otherwise the
 * first one.
 * @param {{ _id: string, personal?: boolean, owner?: string }[]} organizations
 * @param {string} userId
 * @param {string|null} favoriteId
 * @returns {string|null}
 */
export function pickDefaultOrganization(organizations, userId, favoriteId) {
  const favorite = organizations.find((org) => org._id === favoriteId)
  if (favorite) return favorite._id
  const personal = organizations.find(
    (org) => org.personal && org.owner === userId,
  )
  if (personal) return personal._id
  return organizations[0]?._id ?? null
}
