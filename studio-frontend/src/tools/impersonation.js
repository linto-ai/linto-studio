const STORAGE_KEY = "impersonatedOrganizationId"

export function getImpersonatedOrgId() {
  return sessionStorage.getItem(STORAGE_KEY)
}

export function setImpersonatedOrgId(organizationId) {
  sessionStorage.setItem(STORAGE_KEY, organizationId)
}

export function clearImpersonatedOrgId() {
  sessionStorage.removeItem(STORAGE_KEY)
}
