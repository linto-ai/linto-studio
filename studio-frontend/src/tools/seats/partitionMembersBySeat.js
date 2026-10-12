import { isCollaboratorRole } from "./isCollaboratorRole.js"

/**
 * Splits organization members into the ones holding a billed seat (collaborator
 * role) and the free, read-only ones.
 * @param {Array<{role: number}>} members
 * @returns {{seated: Array, free: Array}}
 */
export function partitionMembersBySeat(members) {
  const seated = []
  const free = []
  for (const member of members || []) {
    if (isCollaboratorRole(member.role)) seated.push(member)
    else free.push(member)
  }
  return { seated, free }
}
