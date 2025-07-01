import RIGHTS from "@/const/userRights.js"
import i18n from "@/i18n"

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
    getUserRightTxt(right) {
      if (this.hasFullRight(right)) {
        return i18n.t("conversation.members_right_txt.full_rights")
      }

      if (this.hasShareRight(right)) {
        return i18n.t("conversation.members_right_txt.share")
      }

      if (this.hasWriteRight(right)) {
        return i18n.t("conversation.members_right_txt.write")
      }

      if (this.hasCommentRight(right)) {
        return i18n.t("conversation.members_right_txt.comment")
      }

      if (this.hasReadRight(right)) {
        return i18n.t("conversation.members_right_txt.read")
      }

      return i18n.t("conversation.members_right_txt.none")
    },
  },
}
