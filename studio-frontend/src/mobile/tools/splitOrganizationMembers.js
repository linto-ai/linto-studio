/**
 * Organization members of a conversation, split for the share sheet:
 * privileged (role at or above `privilegedRole`, rights fixed by the role),
 * exceptions (right different from the organization default), regular.
 * @param {{ _id: string, right: number }[]} members
 * @param {Map<string, number>} roleById - organization role per user id
 * @param {number} defaultRight
 * @param {number} privilegedRole
 * @returns {{ privileged: object[], exceptions: object[], regular: object[] }}
 */
export function splitOrganizationMembers(
  members,
  roleById,
  defaultRight,
  privilegedRole,
) {
  const result = { privileged: [], exceptions: [], regular: [] }
  for (const member of members) {
    const role = roleById.get(member._id) ?? null
    const entry = { ...member, role }
    if (role !== null && role >= privilegedRole) result.privileged.push(entry)
    else if (member.right !== defaultRight) result.exceptions.push(entry)
    else result.regular.push(entry)
  }
  return result
}
