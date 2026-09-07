import { mapActions, mapGetters } from "vuex"
import i18n from "@/i18n"
import { PLATFORM_ROLES as ROLES } from "@/const/platformRoles.js"
import {
  roleIsUser,
  roleIsOrganizationInitiator,
  roleIsSessionOperator,
  roleIsSystemAdministrator,
  roleIsSuperAdministrator,
  isAtLeastSystemAdministrator,
  computeRoleValue,
} from "@/tools/platformRoles.js"

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
    roleIsUser,
    roleIsOrganizationInitiator,
    roleIsSessionOperator,
    roleIsSystemAdministrator,
    roleIsSuperAdministrator,
    computeRoleValue,
  },
  computed: {
    ...mapGetters("user", { platformRole: "getUserPlatformRole" }),
    isOrganizationInitiator() {
      return roleIsOrganizationInitiator(this.platformRole)
    },
    isSessionOperator() {
      return roleIsSessionOperator(this.platformRole)
    },
    isSystemAdministrator() {
      return roleIsSystemAdministrator(this.platformRole)
    },
    isSuperAdministrator() {
      return roleIsSuperAdministrator(this.platformRole)
    },
    isAtLeastSystemAdministrator() {
      return isAtLeastSystemAdministrator(this.platformRole)
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
