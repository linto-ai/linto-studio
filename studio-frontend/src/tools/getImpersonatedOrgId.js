import { IMPERSONATED_ORGANIZATION_STORAGE_KEY } from "../const/impersonation.js"

export function getImpersonatedOrgId() {
  return sessionStorage.getItem(IMPERSONATED_ORGANIZATION_STORAGE_KEY)
}
