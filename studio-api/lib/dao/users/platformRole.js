module.exports = Object.freeze({
  UNDEFINED: 0,
  USER: 1,
  SESSION_OPERATOR: 2,
  SYSTEM_ADMINISTRATOR: 4,
  SUPER_ADMINISTRATOR: 8,

  userRole: () => {
    return this.USER
  },

  sessionOperatorRole: () => {
    return this.USER + this.SESSION_OPERATOR
  },

  systemAdministratorRole: () => {
    return this.USER + this.SYSTEM_ADMINISTRATOR
  },

  superAdministratorRole: () => {
    return (
      this.USER +
      this.SESSION_OPERATOR +
      this.SYSTEM_ADMINISTRATOR +
      this.SUPER_ADMINISTRATOR
    )
  },

  hasPlatformRoleAccess: (userRight, desiredRight) =>
    (userRight & desiredRight) == desiredRight,
})
