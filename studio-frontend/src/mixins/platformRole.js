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
      return this.userRole === 0
    },
    isUser() {
      return this.userRole === ROLES.USER
    },
    isSessionOperator() {
      return this.userRole === ROLES.SESSION_OPERATOR
    },
    isSystemAdministrator() {
      return this.userRole === ROLES.SYSTEM_ADMINISTRATOR
    },
    isSuperAdministrator() {
      return this.userRole === ROLES.SUPER_ADMINISTRATOR
    },
    isAtLeastSessionOperator() {
      return this.userRole >= ROLES.SESSION_OPERATOR
    },
    isAtLeastSystemAdministrator() {
      return this.userRole >= ROLES.SYSTEM_ADMINISTRATOR
    },
    userRole() {
      return this.$store.state.userInfo.role
    },
  },
}
