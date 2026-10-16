import { computeSeatRoleOptions } from "./computeSeatRoleOptions.js"
import { isCollaboratorRole } from "./isCollaboratorRole.js"

/**
 * The roles an invitation can carry: the free member role, then the seat roles
 * the viewer may grant, disabled when no seat is left.
 * @param {Array<{value: number, name: string}>} roles - every organization role
 * @param {number|null} maxRole - the viewer's own role, null for no cap
 * @param {boolean} isSeatAvailable - false when the per-seat plan is full
 * @returns {Array<{value: number, name: string, disabled: boolean}>} lowest first
 */
export function computeInviteRoleOptions(roles, maxRole, isSeatAvailable) {
  const freeRoles = roles.filter((role) => !isCollaboratorRole(role.value))
  const seatRoles = computeSeatRoleOptions(roles, maxRole)
  return [
    ...freeRoles.map((role) => ({ ...role, disabled: false })),
    ...seatRoles.map((role) => ({ ...role, disabled: !isSeatAvailable })),
  ]
}
