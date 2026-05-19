import { getCookie } from "@/tools/getCookie"
import { getUserRoleInOrganization } from "@/tools/getUserRoleInOrganization"
const getters = {
  getOrganizations(state) {
    return state.organizations
  },
  getOrganizationById: (state) => (id) => {
    return state.organizations[id]
  },
  getDefaultOrganizationId(state, getters, rootState, rootGetters) {
    const favoriteOrgId = rootGetters["user/getFavoriteOrganizationId"]
    if (favoriteOrgId && state.organizations[favoriteOrgId]) {
      return favoriteOrgId
    }

    if (
      state.currentOrganizationScope &&
      state.organizations[state.currentOrganizationScope]
    ) {
      return state.currentOrganizationScope
    }

    const cookie = getCookie("organizationScope")
    if (cookie && state.organizations[cookie]) {
      return cookie
    }

    return Object.values(state.organizations)?.[0]?._id || null
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
