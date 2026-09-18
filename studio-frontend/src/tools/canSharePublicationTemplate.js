import { isPublicationTemplateOwner } from "./isPublicationTemplateOwner.js"

// Only an organization manager can open one of their own templates to the
// whole organization (or make it personal again).
export function canSharePublicationTemplate(
  template,
  userId,
  canManageOrganization,
) {
  if (!template || template.scope === "system") return false
  return (
    Boolean(canManageOrganization) &&
    isPublicationTemplateOwner(template, userId)
  )
}
