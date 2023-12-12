const ROLES = [
  {
    name: "Member",
    value: 1,
  },
  {
    name: "Uploader",
    value: 2,
  },
  {
    name: "Maintainer",
    value: 3,
  },
  {
    name: "Administrator",
    value: 4,
  },
]

const ROLES_INDEXED_BY_VALUE = ROLES.reduce((acc, role) => {
  acc[role.value] = role
  return acc
}, {})

export const orgaRoleMixin = {
  methods: {
    isInOrganization(organizationId) {
      return this.$store.state.rolesInOrganizations.has(organizationId)
    },
    isAtLeastMaintainerOfOrganization(organizationId) {
      if (!this.isInOrganization(organizationId)) return false
      return (
        this.$store.state.rolesInOrganizations.get(organizationId).myrole >= 3
      )
    },
  },
  computed: {
    userRole() {
      return this.$store.getters.getUserRoleInOrganization()
    },
    isMember() {
      return this.userRole === 1
    },
    isUploader() {
      return this.userRole === 2
    },
    isMaintainer() {
      return this.userRole === 3
    },
    isAdmin() {
      return this.userRole === 4
    },
    isAtLeastMember() {
      return this.userRole >= 1
    },
    isAtLeastUploader() {
      return this.userRole >= 2
    },
    isAtLeastMaintainer() {
      return this.userRole >= 3
    },
    maxRoleValue() {
      return 4
    },
    userRoles() {
      return ROLES
    },
    roleToString() {
      if (this.userRole > 4 || this.userRole < 1) return this.$t("Unknown")

      return ROLES_INDEXED_BY_VALUE[this.userRole].name
    },
    userOrganizations() {
      return this.$store.state.userOrganizations
    },
  },
}
