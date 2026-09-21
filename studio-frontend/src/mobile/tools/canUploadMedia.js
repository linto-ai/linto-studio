import { ORGANIZATION_PERMISSIONS } from "../../const/organizationPermissions.js"
import { ORGANIZATION_ROLES } from "../../const/organizationRoles.js"

const { UPLOAD } = ORGANIZATION_PERMISSIONS

/**
 * Same rule as the server conversation creation route: the organization
 * needs the upload permission and the user at least the uploader role.
 * @param {number} organizationPermissions - permission bitmask of the organization
 * @param {number} organizationRole - role of the user in that organization
 * @returns {boolean}
 */
export function canUploadMedia(organizationPermissions, organizationRole) {
  const hasUploadPermission = (organizationPermissions & UPLOAD) === UPLOAD
  return hasUploadPermission && organizationRole >= ORGANIZATION_ROLES.UPLOADER
}
