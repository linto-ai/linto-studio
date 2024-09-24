const ROLES = {
  UNDEFINED: 0,
  USER: 1,
  SESSION_OPERATOR: 2,
  SYSTEM_ADMINISTRATOR: 4,
  SUPER_ADMINISTRATOR: 8,
}

export const platformRoleMixin = {
  methods: {
    roleIsUser(role) {
      return (role & ROLES.USER) == ROLES.USER
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
    hasNoRole() {
      return this.platformRole === 0
    },
    isUser() {
      return this.roleIsSessionOperator(this.platformRole)
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
    isAtLeastSessionOperator() {
      return this.platformRole >= ROLES.SESSION_OPERATOR
    },
    isAtLeastSystemAdministrator() {
      return this.isSystemAdministrator || this.isSuperAdministrator
    },
    platformRole() {
      return this.$store.state.userInfo.role
    },
    roles_dict() {
      return ROLES
    },
  },
}
