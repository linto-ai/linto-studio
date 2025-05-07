import { getUserRoleInOrganization } from "@/tools/getUserRoleInOrganization"
const getters = {
  getOrganizations(state) {
    return state.organizations
  },
  getOrganizationById: (state) => (id) => {
    return state.organizations[id]
  },
  getDefaultOrganization(state) {
    return Object.values(state.organizations)?.[0] || null
  },
  getOrganizationsAsArray(state) {
    return Object.values(state.organizations)
  },
  getOrganizationLength(state) {
    return Object.keys(state.organizations).length
  },
  getCurrentOrganizationScope(state) {
    return state.currentOrganizationScope
  },
  getCurrentOrganization(state) {
    return state.organizations[state.currentOrganizationScope]
  },
  getUserRoleInOrganization: (state, getters, rootState, rootGetters) => {
    let organization = getters.getCurrentOrganization
    const userId = rootGetters["user/getUserId"]
    return getUserRoleInOrganization(organization, userId)
  },
  isInOrganization: (state) => (organizationId) => {
    return state.rolesInOrganizations.has(organizationId)
  },
  isAtLeastMaintainerOfOrganization: (state, getters) => (organizationId) => {
    if (!getters.isInOrganization(organizationId)) return false
    return state.rolesInOrganizations.get(organizationId).myrole >= 4
  },
}

export default getters
