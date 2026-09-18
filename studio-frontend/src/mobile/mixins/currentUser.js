import { mapGetters } from "vuex"
import { userName } from "@/tools/userName"
import { computeInitials } from "@/mobile/tools/computeInitials.js"
import { orgDisplayName } from "@/tools/orgDisplayName"
import { getOrganizationRoleKey } from "@/mobile/tools/getOrganizationRoleKey.js"

// Everything a mobile page needs to display "who am I, in which org".
// Keeps the store access in one place instead of every view.
export const currentUserMixin = {
  computed: {
    ...mapGetters("user", { userInfos: "getUserInfos", userId: "getUserId" }),
    ...mapGetters("organizations", {
      currentOrganization: "getCurrentOrganization",
      organizationId: "getCurrentOrganizationScope",
      organizationRole: "getUserRoleInOrganization",
    }),
    userName() {
      return userName(this.userInfos)
    },
    email() {
      return this.userInfos?.email ?? ""
    },
    initials() {
      return computeInitials(this.userName)
    },
    organizationName() {
      return orgDisplayName(this.currentOrganization, this.userId)
    },
    roleLabel() {
      const key = getOrganizationRoleKey(this.organizationRole)
      return this.$t(`organization_role.${key}`)
    },
  },
}
