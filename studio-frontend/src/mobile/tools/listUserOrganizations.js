import { getUserRoleInOrganization } from "../../tools/getUserRoleInOrganization.js"

/**
 * The user's organizations as the picker shows them: a display name (the
 * user's own personal organization gets `personalLabel`) and the user's
 * role in each.
 * @param {object[]} organizations
 * @param {string} userId
 * @param {string} personalLabel - localized "my space"
 * @returns {object[]}
 */
export function listUserOrganizations(organizations, userId, personalLabel) {
  return organizations.map((organization) => ({
    ...organization,
    displayName:
      organization.personal && organization.owner === userId
        ? personalLabel
        : organization.name,
    role: getUserRoleInOrganization(organization, userId),
  }))
}
