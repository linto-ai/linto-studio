module.exports = Object.freeze({
  "UNDEFINED": 0,
  "GUEST": 1,
  "MEMBER": 2,
  "MAINTAINER": 4,
  "ADMIN": 8,
  "OWNER": 8,
  asRightAccess: (userRight, desiredRight) => (userRight >= desiredRight)
})
