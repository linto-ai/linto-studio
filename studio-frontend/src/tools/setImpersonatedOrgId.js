import { IMPERSONATED_ORGANIZATION_STORAGE_KEY } from "../const/impersonation.js"

export function setImpersonatedOrgId(organizationId) {
  sessionStorage.setItem(IMPERSONATED_ORGANIZATION_STORAGE_KEY, organizationId)
}
