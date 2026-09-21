import { ORGANIZATION_PERMISSIONS } from "../../const/organizationPermissions.js"
import { ORGANIZATION_ROLES } from "../../const/organizationRoles.js"

const { MICROPHONE } = ORGANIZATION_PERMISSIONS

/**
 * Same rule as the server quick meeting route and the classic "live" tab:
 * the organization needs the microphone permission and the user at least
 * the quick meeting role.
 * @param {number} organizationPermissions - permission bitmask of the organization
 * @param {number} organizationRole - role of the user in that organization
 * @returns {boolean}
 */
export function canStartLive(organizationPermissions, organizationRole) {
  const hasMicrophonePermission =
    (organizationPermissions & MICROPHONE) === MICROPHONE
  return (
    hasMicrophonePermission &&
    organizationRole >= ORGANIZATION_ROLES.QUICK_MEETING
  )
}
