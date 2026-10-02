import { isCollaboratorRole } from "./isCollaboratorRole.js"

/**
 * How many seats a batch of role assignments consumes. Only a member moving
 * from a free role to a collaborator role takes a seat: re-roling someone who
 * already holds one costs nothing, which mirrors the server-side seat check.
 * @param {Array<{role: number, currentRole: number}>} assignments
 * @returns {number}
 */
export function computeSeatsNeeded(assignments) {
  return (assignments || []).filter(
    (assignment) =>
      isCollaboratorRole(assignment.role) &&
      !isCollaboratorRole(assignment.currentRole),
  ).length
}
