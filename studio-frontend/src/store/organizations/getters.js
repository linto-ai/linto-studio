import { getCookie } from "@/tools/getCookie"
import { getUserRoleInOrganization } from "@/tools/getUserRoleInOrganization"
const getters = {
  getOrganizations(state) {
    return state.organizations
  },
  getOrganizationById: (state) => (id) => {
    return state.organizations[id]
  },
  getDefaultOrganizationId(state) {
    const cookie = getCookie("organizationScope")
    const res =
      state.currentOrganizationScope ||
      cookie ||
      Object.values(state.organizations)?.[0]._id ||
      null

    if (!state.organizations[res]) {
      return Object.values(state.organizations)?.[0]._id
    }
    return res
  },
  getOrganizationsAsArray(state) {
    return Object.values(state.organizations)
  },
  getOrganizationLength(state) {
    return Object.keys(state.organizations).length
  },
  getCurrentOrganizationScope(state, getters) {
    return state.currentOrganizationScope ?? getters.getDefaultOrganizationId
  },
  getCurrentOrganization(state) {
    return state.currentOrganization
  },
  getCurrentOrganizationUsers(state) {
    return state.currentOrganization?.users ?? []
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
  getCurrentScope: (state) => {
    return state.currentScope
  },
  getCurrentFilterStatus: (state) => {
    return state.currentFilterStatus
  },
  getStoreScope: (state) => {
    const currentScope = state.currentScope
    const orgaScope = state.currentOrganizationScope
    const filterStatus = state.currentFilterStatus

    return (
      currentScope.replace("organization", orgaScope + "/" + filterStatus) +
      "/conversations"
    )
  },
}

export default getters
