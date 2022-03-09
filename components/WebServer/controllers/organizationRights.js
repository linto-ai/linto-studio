const RIGHTS = Object.freeze({
  "UNDEFINED": 0,
  "READ": 1,
  "WRITE": 2,
  "DOWNLOAD": 4,
  "ADMIN": 8,
  asRightAccess: (userRight, desiredRight) => ((userRight & desiredRight) == desiredRight)
})

module.exports = RIGHTS