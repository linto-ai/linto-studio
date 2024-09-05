const roles = Object.freeze({
  UNDEFINED: 0,
  USER: 1,
  SESSION_OPERATOR: 2,
  SYSTEM_ADMINISTRATOR: 4,
  SUPER_ADMINISTRATOR: 8,

  userRole: function () {
    return roles.USER
  },

  sessionOperatorRole: function () {
    return roles.USER + roles.SESSION_OPERATOR
  },

  systemAdministratorRole: function () {
    return roles.USER + roles.SYSTEM_ADMINISTRATOR
  },

  superAdministratorRole: function () {
    return (
      roles.USER +
      roles.SESSION_OPERATOR +
      roles.SYSTEM_ADMINISTRATOR +
      roles.SUPER_ADMINISTRATOR
    )
  },

  hasPlatformRoleAccess: function (userRight, desiredRight) {
    return (userRight & desiredRight) === desiredRight
  },

  isValid(role) {
    return (role & roles.superAdministratorRole()) === role
  },
})

module.exports = roles
