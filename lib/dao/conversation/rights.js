const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)

const RIGHTS = Object.freeze({
  "UNDEFINED": 0,
  "READ": 1,
  "COMMENT": 2,
  "WRITE": 4,
  "DELETE": 8,
  "SHARE": 16,

  hasRightAccess: (userRight, desiredRight) => ((userRight & desiredRight) == desiredRight),
  uploaderRight: () => { return (RIGHTS.READ + RIGHTS.COMMENT + RIGHTS.WRITE) },
  maintainerRight: () => { return (RIGHTS.READ + RIGHTS.COMMENT + RIGHTS.WRITE + RIGHTS.SHARE) },
  adminRight: () => { return RIGHTS.READ + RIGHTS.COMMENT + RIGHTS.WRITE + RIGHTS.SHARE + RIGHTS.DELETE },
  setRight: (role, convRight) => {
    if (role === ROLES.ADMIN) {
      return RIGHTS.adminRight()
    } else if (role === ROLES.MAINTAINER) {
      return RIGHTS.maintainerRight()
    } else if (role === ROLES.UPLOADER) {
      return RIGHTS.uploaderRight()
    } else {
      return convRight
    }
  }
})

module.exports = RIGHTS