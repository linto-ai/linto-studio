const roles = Object.freeze({
  UNDEFINED: 0,
  MEMBER: 1,
  UPLOADER: 2,
  QUICK_MEETING: 3,
  MEETING_MANAGER: 4,
  MAINTAINER: 5,
  ADMIN: 6,
  hasRoleAccess: (userRole, desiredRole) => userRole >= desiredRole,
  canGiveAccess: (newUser, connectedUser) => !(newUser <= connectedUser),
  hasRevokeRoleAccess: (updatedRole, userRole) => updatedRole <= userRole,
  checkValue: (userRole) => userRole >= 1 && userRole <= 6,
  print(userRole) {
    const sortedRoles = Object.entries(roles).sort((a, b) => b[1] - a[1]) // Sort by value descending

    for (const [role, value] of sortedRoles) {
      if (userRole >= value) {
        return role
      }
    }
    return "UNKNOWN ROLE"
  },
})

module.exports = roles
