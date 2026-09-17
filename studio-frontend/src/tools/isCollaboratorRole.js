import { ORGANIZATION_ROLES } from "../const/organizationRoles.js"

// A collaborator occupies a billed seat: uploader role or higher
export function isCollaboratorRole(role) {
  return role >= ORGANIZATION_ROLES.UPLOADER
}
