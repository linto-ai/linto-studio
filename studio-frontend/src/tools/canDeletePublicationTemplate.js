import { isPublicationTemplateOwner } from "./isPublicationTemplateOwner.js"

// Owners delete their own templates, organization managers also delete the
// ones shared with the organization. System templates are read-only.
export function canDeletePublicationTemplate(
  template,
  userId,
  canManageOrganization,
) {
  if (!template || template.scope === "system") return false
  if (isPublicationTemplateOwner(template, userId)) return true
  return template.scope === "organization" && Boolean(canManageOrganization)
}
