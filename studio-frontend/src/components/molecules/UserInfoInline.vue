<template>
  <div class="flex align-center user-info-inline gap-small flex1">
    <img
      v-if="showImage"
      :src="imgFullPath(user.img)"
      class="user-info-inline__avatar" />
    <div v-if="user" class="flex col align-top flex1 text-cut">
      <div class="user-info-inline__name flex align-top fullwidth gap-tiny">
        <span
          class="flex1 text-cut"
          :title="userData.firstname + ' ' + userData.lastname"
          >{{ userData.firstname }} {{ userData.lastname }}</span
        >
        <span class="user-info-inline__external" v-if="external">External</span>
      </div>
      <div class="user-info-inline__email text-cut">({{ userData.email }})</div>
      <div v-if="roleLabel" class="user-info-inline__role">
        {{ roleLabel }}
      </div>
    </div>
    <div v-else>-</div>
    <slot></slot>
  </div>
</template>
<script>
import { getUserInfo } from "@/tools/getUserInfo.js"
import { getEnv } from "@/tools/getEnv"
import { ORGANIZATION_ROLES } from "@/const/organizationRoles.js"
export default {
  props: {
    userId: { required: true },
    user: { required: false },
    external: { required: false, default: false },
    role: { type: Number, default: null },
    showImage: {
      default: true,
    },
  },
  computed: {
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
  methods: {
    imgFullPath(imgPath) {
      return (
        getEnv("VUE_APP_PUBLIC_MEDIA") +
        "/" +
        (imgPath || "pictures/default.jpg")
      )
    },
  },
}
</script>
