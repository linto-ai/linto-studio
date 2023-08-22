module.exports = Object.freeze({
  "UNDEFINED": 0,
  "MEMBER": 1,
  "UPLOADER": 2,
  "MAINTAINER": 3,
  "ADMIN": 4,
  hasRoleAccess: (userRole, desiredRole) => (userRole >= desiredRole),
  canGiveAccess: (newUser, connectedUser) => !(newUser <= connectedUser),
  hasRevokeRoleAccess: (updatedRole, userRole) => (updatedRole <= userRole),
  checkValue: (userRole) => (userRole >= 1 && userRole <= 3)
})
