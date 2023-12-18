const RIGHTS = Object.freeze({
  UNDEFINED: 0,
  READ: 1,
  COMMENT: 2,
  WRITE: 4,
  DELETE: 8,
  SHARE: 16,
})

export const convRoleMixin = {
  methods: {
    hasNoRight(right) {
      return right === 0
    },
    hasRightAccess: (userRight, desiredRight) =>
      (userRight & desiredRight) == desiredRight,
    hasReadRight(right) {
      return this.hasRightAccess(right, RIGHTS.READ)
    },
    hasCommentRight(right) {
      return this.hasRightAccess(right, RIGHTS.COMMENT)
    },
    hasWriteRight(right) {
      return this.hasRightAccess(right, RIGHTS.WRITE)
    },
    hasDeleteRight(right) {
      return this.hasRightAccess(right, RIGHTS.DELETE)
    },
    hasShareRight(right) {
      return this.hasRightAccess(right, RIGHTS.SHARE)
    },
    hasFullRight(right) {
      return right === 31
    },
  },
}
