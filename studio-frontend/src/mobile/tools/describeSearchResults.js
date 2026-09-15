const ADMIN_RIGHT = 31
const MAINTAINER_RIGHT = 23

/**
 * Search results of the share sheet with what the conversation grants each
 * user today: role-fixed rights for maintainers and administrators, the
 * explicit right when shared, the organization default for other members,
 * nothing for outsiders.
 * @param {{ _id: string }[]} results
 * @param {{ roleById: Map<string, number>, sharedById: Map<string, { right: number }>,
 *   defaultRight: number, privilegedRole: number, adminRole: number }} context
 * @returns {object[]}
 */
export function describeSearchResults(
  results,
  { roleById, sharedById, defaultRight, privilegedRole, adminRole },
) {
  return results.map((user) => {
    const role = roleById.get(user._id) ?? null
    const inOrganization = role !== null
    const privileged = inOrganization && role >= privilegedRole
    const shared = sharedById.get(user._id)
    let right = 0
    if (privileged) right = role >= adminRole ? ADMIN_RIGHT : MAINTAINER_RIGHT
    else if (shared) right = shared.right
    else if (inOrganization) right = defaultRight
    return { ...user, role, inOrganization, privileged, right }
  })
}
