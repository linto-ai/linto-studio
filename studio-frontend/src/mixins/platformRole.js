const ROLES = {
  UNDEFINED: 0,
  USER: 1,
  SESSION_OPERATOR: 2,
  SYSTEM_ADMINISTRATOR: 4,
  SUPER_ADMINISTRATOR: 8,
}

export const platformRoleMixin = {
  computed: {
    hasNoRole() {
      return this.platformRole === 0
    },
    isUser() {
      return (this.platformRole & ROLES.USER) == ROLES.USER
    },
    isSessionOperator() {
      return (
        (this.platformRole & ROLES.SESSION_OPERATOR) == ROLES.SESSION_OPERATOR
      )
    },
    isSystemAdministrator() {
      return (
        (this.platformRole & ROLES.SYSTEM_ADMINISTRATOR) ==
        ROLES.SYSTEM_ADMINISTRATOR
      )
    },
    isSuperAdministrator() {
      return (
        (this.platformRole & ROLES.SUPER_ADMINISTRATOR) ==
        ROLES.SUPER_ADMINISTRATOR
      )
    },
    isAtLeastSessionOperator() {
      return this.platformRole >= ROLES.SESSION_OPERATOR
    },
    isAtLeastSystemAdministrator() {
      return isSystemAdministrator || isSuperAdministrator
    },
    platformRole() {
      return this.$store.state.userInfo.role
    },
  },
}
