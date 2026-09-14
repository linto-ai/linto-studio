import { ORGANIZATION_ROLES } from "../../const/organizationRoles.js"

const ROLE_KEYS = Object.freeze({
  [ORGANIZATION_ROLES.MEMBER]: "member",
  [ORGANIZATION_ROLES.UPLOADER]: "uploader",
  [ORGANIZATION_ROLES.QUICK_MEETING]: "quick_meeting",
  [ORGANIZATION_ROLES.SESSION_OPERATOR]: "session_operator",
  [ORGANIZATION_ROLES.MAINTAINER]: "maintainer",
  [ORGANIZATION_ROLES.ADMINISTRATOR]: "administrator",
})

/**
 * Maps a numeric organization role to its `organization_role.*` i18n key.
 * Unknown or missing roles fall back to "member".
 * @param {number} role
 * @returns {string}
 */
export function getOrganizationRoleKey(role) {
  return ROLE_KEYS[role] ?? "member"
}
