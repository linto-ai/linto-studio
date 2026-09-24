import { ORGANIZATION_ROLES } from "../const/organizationRoles.js"
import { isCollaboratorRole } from "./isCollaboratorRole.js"

/**
 * What the viewer may do to one member. On a backoffice page the viewer's
 * organization role is meaningless (the displayed organization is not theirs),
 * so only the platform role decides. Acting on one's own membership is never a
 * role change or a removal: it is leaving the organization.
 * @param {{_id: string, role: number}} member
 * @param {{id: string, role: number, isSystemAdministrator: boolean, isBackoffice: boolean}} viewer
 * @returns {{canChangeRole: boolean, canRemove: boolean, canLeave: boolean, canGrantSeat: boolean}}
 */
export function computeMemberRights(member, viewer) {
  const isSelf = !!member && !!viewer && member._id === viewer.id
  const canAdminister = viewer?.isBackoffice
    ? !!viewer.isSystemAdministrator
    : viewer?.role >= ORGANIZATION_ROLES.MAINTAINER &&
      viewer?.role >= member?.role
  const canActOnOther = !!canAdminister && !isSelf
  return {
    canChangeRole: canActOnOther,
    canRemove: canActOnOther,
    canLeave: isSelf && !viewer?.isBackoffice,
    canGrantSeat: canActOnOther && !isCollaboratorRole(member?.role),
  }
}
