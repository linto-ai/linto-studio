import { ORGANIZATION_ROLES } from "../const/organizationRoles.js"

/**
 * The roles that occupy a seat, capped at the highest role the viewer may grant
 * (the API refuses granting a role above the caller's own). MEMBER is left out:
 * it is the free role, and taking a seat back is a demotion, not a grant.
 * @param {Array<{value: number, name: string}>} roles - every organization role
 * @param {number|null} maxRole - the viewer's own role, null for no cap
 * @returns {Array<{value: number, name: string}>} seat roles, lowest first
 */
export function computeSeatRoleOptions(roles, maxRole) {
  const cap = maxRole == null ? ORGANIZATION_ROLES.ADMINISTRATOR : maxRole
  return (roles || [])
    .filter(
      (role) => role.value >= ORGANIZATION_ROLES.UPLOADER && role.value <= cap,
    )
    .sort((a, b) => a.value - b.value)
}
