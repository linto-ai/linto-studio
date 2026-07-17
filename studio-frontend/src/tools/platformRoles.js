import { PLATFORM_ROLES } from "../const/platformRoles.js"

// Exact bit check, mirrors the API's hasPlatformRoleAccess: the hierarchy
// only exists at role assignment (higher roles are granted the lower bits).
function hasPlatformRole(role, desiredRole) {
  return (role & desiredRole) === desiredRole
}

export function roleIsUser(role) {
  return hasPlatformRole(role, PLATFORM_ROLES.USER)
}

export function roleIsOrganizationInitiator(role) {
  return hasPlatformRole(role, PLATFORM_ROLES.ORGANIZATION_INITIATOR)
}

export function roleIsSessionOperator(role) {
  return hasPlatformRole(role, PLATFORM_ROLES.SESSION_OPERATOR)
}

export function roleIsSystemAdministrator(role) {
  return hasPlatformRole(role, PLATFORM_ROLES.SYSTEM_ADMINISTRATOR)
}

export function roleIsSuperAdministrator(role) {
  return hasPlatformRole(role, PLATFORM_ROLES.SUPER_ADMINISTRATOR)
}

// SYSTEM and SUPER are two distinct top bits: both grant backoffice access
export function isAtLeastSystemAdministrator(role) {
  return roleIsSystemAdministrator(role) || roleIsSuperAdministrator(role)
}

// roles is an object with PLATFORM_ROLES keys and boolean values
export function computeRoleValue(roles) {
  let roleValue = 0
  for (const key in roles) {
    if (roles[key] === true) {
      roleValue += PLATFORM_ROLES[key]
    }
  }
  return roleValue
}
