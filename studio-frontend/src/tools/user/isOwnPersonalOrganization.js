export function isOwnPersonalOrganization(org, userId) {
  return Boolean(org?.personal && org.owner === userId)
}
