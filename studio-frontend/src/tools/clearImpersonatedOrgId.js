import { IMPERSONATED_ORGANIZATION_STORAGE_KEY } from "../const/impersonation.js"

export function clearImpersonatedOrgId() {
  sessionStorage.removeItem(IMPERSONATED_ORGANIZATION_STORAGE_KEY)
}
