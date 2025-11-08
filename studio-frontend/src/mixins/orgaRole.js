import { mapActions, mapGetters } from "vuex"
import i18n from "@/i18n"

const ROLES = [
  {
    name: i18n.global.t("organization_role.member"),
    description: i18n.global.t("organization_role.member_description"),
    value: 1,
  },
  {
    name: i18n.global.t("organization_role.uploader"),
    description: i18n.global.t("organization_role.uploader_description"),
    value: 2,
  },
  {
    name: i18n.global.t("organization_role.quick_meeting"),
    description: i18n.global.t("organization_role.quick_meeting_description"),
    value: 3,
  },
  {
    name: i18n.global.t("organization_role.session_operator"),
    description: i18n.global.t("organization_role.session_operator_description"),
    value: 4,
  },
  {
    name: i18n.global.t("organization_role.maintainer"),
    description: i18n.global.t("organization_role.maintainer_description"),
    value: 5,
  },
  {
    name: i18n.global.t("organization_role.administrator"),
    description: i18n.global.t("organization_role.administrator_description"),
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
    roleToString(role) {
      if (role > 6 || role < 1) return this.$t("Unknown")
      return ROLES_INDEXED_BY_VALUE[role].name
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
    currentRoleToString() {
      if (this.userRole > 6 || this.userRole < 1) return this.$t("Unknown")
      return ROLES_INDEXED_BY_VALUE[this.userRole].name
    },
  },
}
