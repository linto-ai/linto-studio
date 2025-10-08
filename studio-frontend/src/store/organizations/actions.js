import {
  apiGetOrganizationById,
  apiGetUserOrganizations,
  apiDeleteOrganisation,
} from "@/api/organisation"
import { indexOrganizationsRoles } from "@/tools/indexOrganizationsRoles"
import store from "@/store/index.js"
import createMediaModule from "../modules/mediaModuleFactory"

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

    // Clear selected tags when switching organizations
    await dispatch("tags/clearExploreSelectedTags", null, { root: true })
  },
  async setCurrentFilterStatus({ commit }, status) {
    commit("setCurrentFilterStatus", status)
  },
}

export default actions
