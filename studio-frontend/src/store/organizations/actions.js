import {
  apiGetOrganizationById,
  apiGetUserOrganizations,
  apiDeleteOrganisation,
} from "@/api/organisation"
import { indexOrganizationsRoles } from "@/tools/indexOrganizationsRoles"
import store from "@/store/index.js"
import createMediaModule from "../modules/mediaModuleFactory"
import { setCookie } from "@/tools/setCookie"

const actions = {
  async fetchOrganizations({ commit, rootGetters }) {
    const getOrganizations = await apiGetUserOrganizations()
    if (getOrganizations.status === "success") {
      commit("setOrganizationsFromList", getOrganizations.data)
      let indexedOrganizations = indexOrganizationsRoles(
        getOrganizations.data,
        rootGetters["user/getUserId"],
      )
      commit("setRolesInOrganizations", indexedOrganizations)
    }
    return getOrganizations
  },
  async createOrganization({ commit }, payload) {},
  async updateOrganization({ commit }, id, payload) {},
  async deleteOrganization({ commit }, id) {
    let req = await apiDeleteOrganisation(id)
    if (req.status === "success") {
      commit("deleteOrganization", id)
    }
    return req
  },
  async setCurrentOrganizationScope({ commit, dispatch }, organizationId) {
    let organization = await apiGetOrganizationById(organizationId)

    const scope = `organizations/${organizationId}/conversations`

    setCookie("organizationScope", organizationId, 365)

    if (!store.hasModule(`${organizationId}/done/conversations`)) {
      store.registerModule(
        `${organizationId}/done/conversations`,
        createMediaModule(scope, "done"),
      )
    }

    if (!store.hasModule(`${organizationId}/processing/conversations`)) {
      store.registerModule(
        `${organizationId}/processing/conversations`,
        createMediaModule(scope, "processing"),
      )
    }

    if (!store.hasModule(`${organizationId}/error/conversations`)) {
      store.registerModule(
        `${organizationId}/error/conversations`,
        createMediaModule(scope, "error"),
      )
    }

    commit("setCurrentOrganization", organization)
    commit("setCurrentOrganizationScope", organizationId)
    // Reset the M2M-augmented cache: it belongs to the previous org.
    commit("setCurrentOrganizationAllUsers", [])

    // Clear selected tags when switching organizations
    await dispatch("tags/clearExploreSelectedTags", null, { root: true })
  },
  async setCurrentFilterStatus({ commit }, status) {
    commit("setCurrentFilterStatus", status)
  },
  /**
   * Load the current organization with M2M users (API keys) included in
   * the users array. Stored separately from currentOrganization to avoid
   * leaking API keys into UIs that only want human members.
   *
   * Idempotent: subsequent calls reuse the cached value unless forceRefresh.
   */
  async loadCurrentOrganizationAllUsers(
    { commit, state },
    { forceRefresh = false } = {},
  ) {
    const organizationId = state.currentOrganizationScope
    if (!organizationId) return []
    if (
      !forceRefresh &&
      state.currentOrganizationAllUsers &&
      state.currentOrganizationAllUsers.length > 0
    ) {
      return state.currentOrganizationAllUsers
    }
    const organization = await apiGetOrganizationById(organizationId, null, {
      includeM2m: true,
    })
    const users = organization?.users ?? []
    commit("setCurrentOrganizationAllUsers", users)
    return users
  },
}

export default actions
