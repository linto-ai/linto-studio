import { mapActions, mapGetters } from "vuex"
import i18n from "@/i18n"

const ROLES = [
  {
    name: i18n.t("organization_role.member"),
    value: 1,
  },
  {
    name: i18n.t("organization_role.uploader"),
    value: 2,
  },
  {
    name: i18n.t("organization_role.quick_meeting"),
    value: 3,
  },
  {
    name: i18n.t("organization_role.session_operator"),
    value: 4,
  },
  {
    name: i18n.t("organization_role.maintainer"),
    value: 5,
  },
  {
    name: i18n.t("organization_role.administrator"),
    value: 6,
  },
]

const ROLES_INDEXED_BY_VALUE = ROLES.reduce((acc, role) => {
  acc[role.value] = role
  return acc
}, {})

export const orgaRoleMixin = {
  methods: {
    isInOrganization(organizationId) {
      return this.$store.getters["organizations/isInOrganization"](
        organizationId,
      )
    },
    isAtLeastMaintainerOfOrganization(organizationId) {
      return this.$store.getters[
        "organizations/isAtLeastMaintainerOfOrganization"
      ](organizationId)
    },
  },
  computed: {
    ...mapGetters("organizations", {
      userRole: "getUserRoleInOrganization",
      userOrganizations: "getOrganizationsAsArray",
    }),
    isMember() {
      return this.userRole === 1
    },
    isUploader() {
      return this.userRole === 2
    },
    isQuickMeeting() {
      return this.userRole === 3
    },
    isMeetingManager() {
      return this.userRole === 4
    },
    isMaintainer() {
      return this.userRole === 5
    },
    isAdmin() {
      return this.userRole === 6
    },
    isAtLeastMember() {
      return this.userRole >= 1
    },
    isAtLeastUploader() {
      return this.userRole >= 2
    },
    isAtLeastQuickMeeting() {
      return this.userRole >= 3
    },
    isAtLeastMeetingManager() {
      return this.userRole >= 4
    },
    isAtLeastMaintainer() {
      return this.userRole >= 5
    },
    maxRoleValue() {
      return 6
    },
    userRoles() {
      return ROLES
    },
    roleToString() {
      if (this.userRole > 6 || this.userRole < 1) return this.$t("Unknown")
      return ROLES_INDEXED_BY_VALUE[this.userRole].name
    },
  },
}
