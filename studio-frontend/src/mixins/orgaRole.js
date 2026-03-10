import { mapActions, mapGetters } from "vuex"
import i18n from "@/i18n"
import { ORGANIZATION_ROLES } from "@/const/organizationRoles"

const ROLES = [
  {
    name: i18n.t("organization_role.member"),
    description: i18n.t("organization_role.member_description"),
    value: ORGANIZATION_ROLES.MEMBER,
  },
  {
    name: i18n.t("organization_role.uploader"),
    description: i18n.t("organization_role.uploader_description"),
    value: ORGANIZATION_ROLES.UPLOADER,
  },
  {
    name: i18n.t("organization_role.quick_meeting"),
    description: i18n.t("organization_role.quick_meeting_description"),
    value: ORGANIZATION_ROLES.QUICK_MEETING,
  },
  {
    name: i18n.t("organization_role.session_operator"),
    description: i18n.t("organization_role.session_operator_description"),
    value: ORGANIZATION_ROLES.SESSION_OPERATOR,
  },
  {
    name: i18n.t("organization_role.maintainer"),
    description: i18n.t("organization_role.maintainer_description"),
    value: ORGANIZATION_ROLES.MAINTAINER,
  },
  {
    name: i18n.t("organization_role.administrator"),
    description: i18n.t("organization_role.administrator_description"),
    value: ORGANIZATION_ROLES.ADMINISTRATOR,
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
    roleToString(role) {
      if (role > ORGANIZATION_ROLES.ADMINISTRATOR || role < ORGANIZATION_ROLES.MEMBER) return this.$t("Unknown")
      return ROLES_INDEXED_BY_VALUE[role].name
    },
  },
  computed: {
    ...mapGetters("organizations", {
      userRole: "getUserRoleInOrganization",
      userOrganizations: "getOrganizationsAsArray",
    }),
    isMember() {
      return this.userRole === ORGANIZATION_ROLES.MEMBER
    },
    isUploader() {
      return this.userRole === ORGANIZATION_ROLES.UPLOADER
    },
    isQuickMeeting() {
      return this.userRole === ORGANIZATION_ROLES.QUICK_MEETING
    },
    isMeetingManager() {
      return this.userRole === ORGANIZATION_ROLES.SESSION_OPERATOR
    },
    isMaintainer() {
      return this.userRole === ORGANIZATION_ROLES.MAINTAINER
    },
    isAdmin() {
      return this.userRole === ORGANIZATION_ROLES.ADMINISTRATOR
    },
    isAtLeastMember() {
      return this.userRole >= ORGANIZATION_ROLES.MEMBER
    },
    isAtLeastUploader() {
      return this.userRole >= ORGANIZATION_ROLES.UPLOADER
    },
    isAtLeastQuickMeeting() {
      return this.userRole >= ORGANIZATION_ROLES.QUICK_MEETING
    },
    isAtLeastMeetingManager() {
      return this.userRole >= ORGANIZATION_ROLES.SESSION_OPERATOR
    },
    isAtLeastMaintainer() {
      return this.userRole >= ORGANIZATION_ROLES.MAINTAINER
    },
    maxRoleValue() {
      return ORGANIZATION_ROLES.ADMINISTRATOR
    },
    userRoles() {
      return ROLES
    },
    currentRoleToString() {
      if (this.userRole > ORGANIZATION_ROLES.ADMINISTRATOR || this.userRole < ORGANIZATION_ROLES.MEMBER) return this.$t("Unknown")
      return ROLES_INDEXED_BY_VALUE[this.userRole].name
    },
  },
}
