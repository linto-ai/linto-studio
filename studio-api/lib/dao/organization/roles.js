module.exports = Object.freeze({
  UNDEFINED: 0,
  MEMBER: 1,
  UPLOADER: 2,
  MEETING_MANAGER: 3,
  MAINTAINER: 4,
  ADMIN: 5,
  hasRoleAccess: (userRole, desiredRole) => userRole >= desiredRole,
  canGiveAccess: (newUser, connectedUser) => !(newUser <= connectedUser),
  hasRevokeRoleAccess: (updatedRole, userRole) => updatedRole <= userRole,
  checkValue: (userRole) => userRole >= 1 && userRole <= 4,
})
