export const PLATFORM_ROLES = Object.freeze({
  UNDEFINED: 0,
  USER: 1,
  ORGANIZATION_INITIATOR: 2,
  SESSION_OPERATOR: 4,
  SYSTEM_ADMINISTRATOR: 8,
  SUPER_ADMINISTRATOR: 16,
})

export function hasPlatformRole(role, desiredRole) {
  return (role & desiredRole) === desiredRole
}

export function isAtLeastSystemAdministrator(role) {
  return (
    hasPlatformRole(role, PLATFORM_ROLES.SYSTEM_ADMINISTRATOR) ||
    hasPlatformRole(role, PLATFORM_ROLES.SUPER_ADMINISTRATOR)
  )
}
