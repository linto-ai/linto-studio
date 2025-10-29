import { mapActions, mapGetters } from "vuex"
import i18n from "@/i18n"

const ROLES = {
  UNDEFINED: 0,
  USER: 1,
  ORGANIZATION_INITIATOR: 2,
  SESSION_OPERATOR: 4,
  SYSTEM_ADMINISTRATOR: 8,
  SUPER_ADMINISTRATOR: 16,
}

const PLATFORM_ROLES = [
  {
    name: i18n.t("platform_role.user"),
    description: i18n.t("platform_role.user_description"),
    value: ROLES.USER,
  },
  {
    name: i18n.t("platform_role.organization_initiator"),
    description: i18n.t("platform_role.organization_initiator_description"),
    value: ROLES.ORGANIZATION_INITIATOR,
  },
  {
    name: i18n.t("platform_role.session_operator"),
    description: i18n.t("platform_role.session_operator_description"),
    value: ROLES.SESSION_OPERATOR,
  },
  {
    name: i18n.t("platform_role.system_administrator"),
    description: i18n.t("platform_role.system_administrator_description"),
    value: ROLES.SYSTEM_ADMINISTRATOR,
  },
  {
    name: i18n.t("platform_role.super_administrator"),
    description: i18n.t("platform_role.super_administrator_description"),
    value: ROLES.SUPER_ADMINISTRATOR,
  },
]

export const platformRoleMixin = {
  methods: {
    roleIsUser(role) {
      return (role & ROLES.USER) == ROLES.USER
    },
    roleIsOrganizationInitiator(role) {
      return (
        (role & ROLES.ORGANIZATION_INITIATOR) == ROLES.ORGANIZATION_INITIATOR
      )
    },
    roleIsSessionOperator(role) {
      return (role & ROLES.SESSION_OPERATOR) == ROLES.SESSION_OPERATOR
    },
    roleIsSystemAdministrator(role) {
      return (role & ROLES.SYSTEM_ADMINISTRATOR) == ROLES.SYSTEM_ADMINISTRATOR
    },
    roleIsSuperAdministrator(role) {
      return (role & ROLES.SUPER_ADMINISTRATOR) == ROLES.SUPER_ADMINISTRATOR
    },
    // roles is an object with keys: USER, SESSION_OPERATOR, SYSTEM_ADMINISTRATOR, SUPER_ADMINISTRATOR and values: true or false
    computeRoleValue(roles) {
      let roleValue = 0
      for (const key in roles) {
        if (roles[key] === true) {
          roleValue += ROLES[key]
        }
      }
      return roleValue
    },
  },
  computed: {
    ...mapGetters("user", { platformRole: "getUserPlatformRole" }),
    hasNoRole() {
      return this.platformRole === 0
    },
    isUser() {
      return this.roleIsSessionOperator(this.platformRole)
    },
    isOrganizationInitiator() {
      return this.roleIsOrganizationInitiator(this.platformRole)
    },
    isSessionOperator() {
      return this.roleIsSessionOperator(this.platformRole)
    },
    isSystemAdministrator() {
      return this.roleIsSystemAdministrator(this.platformRole)
    },
    isSuperAdministrator() {
      return this.roleIsSuperAdministrator(this.platformRole)
    },
    isAtLeastOrganizationInitiator() {
      return this.platformRole >= ROLES.ORGANIZATION_INITIATOR
    },
    isAtLeastSessionOperator() {
      return this.platformRole >= ROLES.SESSION_OPERATOR
    },
    isAtLeastSystemAdministrator() {
      return this.isSystemAdministrator || this.isSuperAdministrator
    },
    isBackofficePage() {
      return this.$route.meta.backoffice
    },

    roles_dict() {
      return ROLES
    },
    platformRoles() {
      return PLATFORM_ROLES
    },
  },
}
