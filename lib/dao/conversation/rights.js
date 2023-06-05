const RIGHTS = Object.freeze({
  "UNDEFINED": 0,
  "READ": 1,
  "COMMENT": 2,
  "WRITE": 4,
  "DELETE": 8,
  "SHARE": 16,

  hasRightAccess: (userRight, desiredRight) => ((userRight & desiredRight) == desiredRight),
  maintainerRight: () => { return (RIGHTS.READ + RIGHTS.COMMENT + RIGHTS.WRITE + RIGHTS.SHARE) },
  adminRight: () => { return RIGHTS.READ + RIGHTS.COMMENT + RIGHTS.WRITE + RIGHTS.SHARE + RIGHTS.DELETE },
  setRight: (role, convRight) => {
    if (role === 3) {
      return RIGHTS.adminRight()
    } else if (role === 2) {
      return RIGHTS.maintainerRight()
    } else {
      return convRight
    }
  }
})

module.exports = RIGHTS