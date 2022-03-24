module.exports = Object.freeze({
  "UNDEFINED": 0,
  "MEMBER": 1,
  "MAINTAINER": 2,
  "ADMIN": 3,
  "OWNER": 3,
  asRoleAccess: (userRole, desiredRole) => (userRole >= desiredRole)
})
