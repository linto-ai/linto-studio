<template>
  <div class="flex align-center user-info-inline gap-small flex1">
    <UserAvatar v-if="showImage && userData" :user="userData" size="xl" />
    <div v-if="user" class="flex col align-top flex1 text-cut">
      <div class="user-info-inline__name flex align-baseline fullwidth gap-tiny">
        <span v-if="fullName" class="text-cut" :title="fullName">{{
          fullName
        }}</span>
        <span v-else class="user-info-inline__name--missing text-cut">{{
          $t("user_info_inline.no_name")
        }}</span>
        <UserIdTag :user-id="userData._id || userId" />
        <span class="user-info-inline__external" v-if="external">External</span>
      </div>
      <div
        v-if="showEmail && userData.email"
        class="user-info-inline__email text-cut">
        ({{ userData.email }})
      </div>
      <div v-if="roleLabel" class="user-info-inline__role">
        {{ roleLabel }}
      </div>
      <div
        v-if="impersonatorLabel"
        class="user-info-inline__impersonated-by text-cut"
        :title="impersonatorLabel">
        <ph-icon name="user-switch" size="xs" />
        {{ impersonatorLabel }}
      </div>
    </div>
    <div v-else>-</div>
    <slot></slot>
  </div>
</template>
<script>
import { getUserInfo } from "@/tools/auth/getUserInfo.js"
import { computeUserFullName } from "@/tools/user/computeUserFullName.js"
import { ORGANIZATION_ROLES } from "@/const/organizationRoles.js"
import UserAvatar from "@/components/atoms/UserAvatar.vue"
import UserIdTag from "@/components/atoms/UserIdTag.vue"
export default {
  components: { UserAvatar, UserIdTag },
  props: {
    userId: { required: true },
    user: { required: false },
    external: { required: false, default: false },
    role: { type: Number, default: null },
    impersonatedBy: { type: Object, default: null },
    showImage: {
      default: true,
    },
    showEmail: { type: Boolean, default: true },
  },
  computed: {
    fullName() {
      return computeUserFullName(this.userData)
    },
    impersonatorLabel() {
      if (!this.impersonatedBy) return ""
      const info = this.impersonatedBy.info
      const name = info?.email || this.impersonatedBy.id
      return this.$t("impersonation.log_label", { name })
    },
    roleLabel() {
      if (this.role == null) return ""
      if (
        this.role < ORGANIZATION_ROLES.MEMBER ||
        this.role > ORGANIZATION_ROLES.ADMINISTRATOR
      ) {
        return ""
      }
      const map = {
        [ORGANIZATION_ROLES.MEMBER]: "organization_role.member",
        [ORGANIZATION_ROLES.UPLOADER]: "organization_role.uploader",
        [ORGANIZATION_ROLES.QUICK_MEETING]: "organization_role.quick_meeting",
        [ORGANIZATION_ROLES.SESSION_OPERATOR]:
          "organization_role.session_operator",
        [ORGANIZATION_ROLES.MAINTAINER]: "organization_role.maintainer",
        [ORGANIZATION_ROLES.ADMINISTRATOR]: "organization_role.administrator",
      }
      return this.$t(map[this.role])
    },
  },
  data() {
    return {
      userData: this.user,
    }
  },
  watch: {
    user: {
      handler: async function (val) {
        if (val) {
          this.userData = val
        } else {
          this.userData = await getUserInfo(this.userId)
        }
      },
      immediate: true,
    },
  },
}
</script>
