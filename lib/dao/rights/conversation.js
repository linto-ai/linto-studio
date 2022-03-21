const RIGHTS = Object.freeze({
  "UNDEFINED": 0,
  "READ": 1,
  "COMMENT": 2,
  "WRITE": 4,
  "DELETE": 8,
  "SHARE": 16,
  asRightAccess: (userRight, desiredRight) => ((userRight & desiredRight) == desiredRight)
})

module.exports = RIGHTS