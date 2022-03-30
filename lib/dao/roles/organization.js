module.exports = Object.freeze({
  "UNDEFINED": 0,
  "MEMBER": 1,
  "MAINTAINER": 2,
  "ADMIN": 3,
  "OWNER": 3,
  asRoleAccess: (userRole, desiredRole) => (userRole >= desiredRole),
  canGiveAccess: (newUser, connectedUser) => !(newUser <= connectedUser),
  asRevokeRoleAccess: (updatedRole, userRole) => (updatedRole <= userRole),
  checkValue: (userRole) => (userRole >= 1 && userRole <= 3)
})
